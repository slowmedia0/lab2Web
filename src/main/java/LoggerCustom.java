import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoggerCustom {
    private static final DateTimeFormatter LOG_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    public static void log(String message) {
        String timestamp = LocalDateTime.now().format(LOG_FORMATTER);
        System.err.println(String.format("[%s] [App] %s", timestamp, message));
    }
}
