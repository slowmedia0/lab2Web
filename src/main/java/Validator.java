import java.awt.*;
import java.lang.reflect.Array;
import java.util.Arrays;

public class Validator {
    public static double[] xRange = {-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2};
    public static int[] rRange = {1, 2, 3 , 4, 5};
    public static boolean validateX(String xStr){
        double x;
        try {
            if (xStr == null) {
                throw new NullPointerException("Field X is null!");
            }
            String trimmedX = xStr.trim().replace(",",".");
            if (trimmedX.isEmpty()){
                throw new NumberFormatException("Field X is empty or whitespace string!");
            }
            try {
                x = Double.parseDouble(trimmedX);
            }
            catch (NumberFormatException e){
                throw new NumberFormatException("Field X should be number!");
            }
            boolean isInRangeX = false;
            for (double elem : xRange){
                if (elem==x){
                    isInRangeX=true;
                    break;
                }
            }
            if (isInRangeX==false){
                throw new IllegalArgumentException("Field X should be in range: " + Arrays.toString(xRange));
            }
            return true;
        }
        catch (NullPointerException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (NumberFormatException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (IllegalArgumentException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return  false;
        }
    }

    public static boolean validateY(String yStr){
        double y;
        try {
            if (yStr == null) {
                throw new NullPointerException("Field Y is null!");
            }
            String trimmedY = yStr.trim().replace(',','.');
            if (trimmedY.isEmpty()){
                throw new NumberFormatException("Field Y is empty or whitespace string!");
            }
            if (trimmedY.length()>15){
                throw new NumberFormatException("Length of input field of Y should not exceed 15 characters!");
            }
            try {
                y = Double.parseDouble(trimmedY);
            }
            catch (NumberFormatException e){
                throw new NumberFormatException("Field Y should be number!");
            }
            if ((y>-5 && y<5)==false){
                throw new IllegalArgumentException("Field Y should be in range: (-5; 5)");
            }
            return true;
        }
        catch (NullPointerException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (NumberFormatException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (IllegalArgumentException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return  false;
        }
    }

    public static boolean validateR(String rStr){
        int r;
        try {
            if (rStr == null) {
                throw new NullPointerException("Field R is null!");
            }
            String trimmedR = rStr.trim().replace(",",".");
            if (trimmedR.isEmpty()){
                throw new NumberFormatException("Field R is empty or whitespace string!");
            }
            try {
                r = Integer.parseInt(trimmedR);
            }
            catch (NumberFormatException e){
                throw new NumberFormatException("Field R should be integer!");
            }
            boolean isInRangeR = false;
            for (double elem : rRange){
                if (elem==r){
                    isInRangeR=true;
                    break;
                }
            }
            if (isInRangeR==false){
                throw new IllegalArgumentException("Field R should be in range: " + Arrays.toString(rRange));
            }
            return true;
        }
        catch (NullPointerException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (NumberFormatException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return false;
        }
        catch (IllegalArgumentException e){
            //Логируем сообщение
            System.err.println(e.getMessage());
            return  false;
        }
    }
}
