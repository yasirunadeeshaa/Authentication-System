package backend.social_media_application.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("File controller is working!");
    }

    @GetMapping("/{directory}/{filename:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String directory,
            @PathVariable String filename) {
        try {
            // Create the file path
            Path filePath = Paths.get(uploadDir)
                    .resolve(directory)
                    .resolve(filename)
                    .normalize();

            // Log the absolute path
            System.out.println("Looking for file at: " + filePath.toAbsolutePath().toString());

            // Check if file exists
            boolean exists = Files.exists(filePath);
            System.out.println("File exists: " + exists);

            // Create a resource from the file path
            Resource resource = new UrlResource(filePath.toUri());

            // Check if the resource exists
            System.out.println("Resource exists: " + resource.exists());

            if (resource.exists()) {
                // Determine content type
                String contentType = determineContentType(filename);
                System.out.println("Content type: " + contentType);

                // Return the resource with appropriate headers
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("File not found at path: " + filePath.toAbsolutePath().toString());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Error serving file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }
}