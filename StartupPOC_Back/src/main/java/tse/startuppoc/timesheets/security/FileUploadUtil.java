package tse.startuppoc.timesheets.security;
import java.io.*;
import java.nio.file.*;
 
import org.springframework.web.multipart.MultipartFile;
 
/**
 * Permet l'upload d'un fichier dans le répertoire exposé
 * @author VWTHO
 */

public class FileUploadUtil {
     
    public static void saveFile(String uploadDir, String fileName,MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(uploadDir);  
        if (Files.exists(uploadPath)) {
        	File[] allContents = uploadPath.toFile().listFiles();
            if (allContents != null) {
                for (File file : allContents) {
                    file.delete();
                }
            }
        	Files.delete(uploadPath);
        }
        
        Files.createDirectories(uploadPath);
         
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {        
            throw new IOException("Could not save image file: " + fileName, ioe);
        }      
    }
}