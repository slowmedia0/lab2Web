import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

public class App {
    public static void main(String[] args) throws IOException {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            LoggerCustom.log("Server is shutting down gracefully...");
        }));
        var fcgiInterface = new FCGIInterface();
        LoggerCustom.log("Server started and waiting for requests.");
        while (fcgiInterface.FCGIaccept() >= 0) {
            long startTime = System.nanoTime();
            var method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            var remoteAddr = FCGIInterface.request.params.getProperty("REMOTE_ADDR");

            if (method == null) {
                LoggerCustom.log("WARN: Request method is null. Remote IP: " + remoteAddr);
                sendJsonResponse(405, "Method Not Allowed", "{\"error\": \"Unsupported HTTP method: null\"}");
                continue;
            }

            if (method.equals("GET")) {
                var queryString = FCGIInterface.request.params.getProperty("QUERY_STRING");
                LoggerCustom.log(String.format("INFO: GET request received. IP: %s, Query: %s", remoteAddr, queryString));

                if (queryString != null && queryString.equals("debug=1")) {
                    LoggerCustom.log("DEBUG: Parameters dump requested.");
                    var paramsDump = FCGIInterface.request
                            .params
                            .entrySet()
                            .stream()
                            .map((entry) -> "%s: %s".formatted(entry.getKey().toString(), entry.getValue().toString()))
                            .reduce("", (acc, el) -> acc + "\n" + el);
                    sendHtmlResponse("<pre>" + paramsDump + "</pre>");
                    continue;
                }

                Map<String, String> params = parseQueryString(queryString);

                if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
                    LoggerCustom.log("WARN: Missing required parameters in query string: " + queryString);
                    sendJsonResponse(400, "Bad Request", "{\"error\": \"Missing required parameters: x, y, r\"}");
                    continue;
                }

                String xStr = params.get("x");
                String yStr = params.get("y");
                String rStr = params.get("r");

                boolean isValid = Validator.validateX(xStr)
                        && Validator.validateY(yStr)
                        && Validator.validateR(rStr);

                if (!isValid) {
                    long executionTime = System.nanoTime() - startTime;
                    String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                    LoggerCustom.log(String.format("VALIDATION_FAIL: x='%s', y='%s', r='%s', executionTime=%d ns", xStr, yStr, rStr, executionTime));

                    String jsonResponse = String.format(
                            "{\"validatePoint\": false, \"popadanie\": false, \"currentTime\": \"%s\", \"executionTime\": \"%d ns\"}",
                            currentTime, executionTime
                    );
                    sendJsonResponse(400, "Bad Request", jsonResponse);
                    continue;
                }

                double x, y;
                int r;
                try {
                    x = Double.parseDouble(xStr.trim().replace(",", "."));
                    y = Double.parseDouble(yStr.trim().replace(",", "."));
                    r = Integer.parseInt(rStr.trim().replace(",", "."));
                } catch (NumberFormatException e) {
                    LoggerCustom.log("ERROR: Number format exception during parsing: " + e.getMessage());
                    sendJsonResponse(400, "Bad Request", "{\"error\": \"Invalid number format\"}");
                    continue;
                }

                boolean isHit = checkArea(x, y, r);
                long executionTime = System.nanoTime() - startTime;
                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                LoggerCustom.log(String.format("SUCCESS: X=%.2f, Y=%.2f, R=%d, hit=%b, executionTime=%d ns", x, y, r, isHit, executionTime));

                String jsonResponse = String.format(
                        "{\"validatePoint\": %b, \"popadanie\": %b, \"currentTime\": \"%s\", \"executionTime\": \"%d ns\"}",
                        isValid, isHit, currentTime, executionTime
                );

                sendJsonResponse(jsonResponse);
                continue;
            }

            LoggerCustom.log("WARN: Unsupported HTTP method: " + method);
            sendJsonResponse(405, "Method Not Allowed", "{\"error\": \"Unsupported HTTP method: " + method + "\"}");
        }
    }

    private static void sendJsonResponse(String jsonBody) {
        sendJsonResponse(200, "OK", jsonBody);
    }

    private static void sendJsonResponse(int statusCode, String statusText, String jsonBody) {
        System.out.println("Status: " + statusCode + " " + statusText);
        System.out.println("Content-Type: application/json; charset=utf-8");
        System.out.println();
        System.out.println(jsonBody);
    }

    private static void sendHtmlResponse(String htmlBody) {
        System.out.println("Status: 200 OK");
        System.out.println("Content-Type: text/html; charset=utf-8");
        System.out.println();
        System.out.println(htmlBody);
    }

    private static Map<String, String> parseQueryString(String qs) {
        Map<String, String> map = new HashMap<>();
        if (qs == null || qs.isEmpty()) return map;
        for (String pair : qs.split("&")) {
            String[] kv = pair.split("=");
            if (kv.length == 2) {
                map.put(kv[0], URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
            } else if (kv.length == 1) {
                map.put(kv[0], "");
            }
        }
        return map;
    }

    private static boolean checkArea(double x, double y, double r) {
        // Прямоугольник
        if (x <= 0 && x >= -r / 2 && y >= 0 && y <= r) {
            return true;
        }
        // Четверть окружности
        if (x <= 0 && y <= 0 && (Math.pow(x, 2) + Math.pow(y, 2)) <= Math.pow(r / 2, 2)) {
            return true;
        }
        // Треугольник
        if (x >= 0 && x <= r && y <= 0 && y >= (-r / 2 + x / 2)) {
            return true;
        }
        return false;
    }
}