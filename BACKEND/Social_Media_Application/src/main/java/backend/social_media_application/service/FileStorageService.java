package backend.social_media_application.service;

import backend.social_media_application.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    /**
     * Initialize upload directory on startup
     */
    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            logger.info("Initializing file storage at: {}", uploadPath);
            Files.createDirectories(uploadPath);

            // Also create subdirectories for avatars and covers
            Files.createDirectories(Paths.get(uploadDir, "avatars").toAbsolutePath().normalize());
            Files.createDirectories(Paths.get(uploadDir, "covers").toAbsolutePath().normalize());

            logger.info("File storage initialized successfully");
        } catch (IOException ex) {
            logger.error("Could not initialize storage location", ex);
            throw new FileStorageException("Could not initialize storage location", ex);
        }
    }

    /**
     * Store a file in the specified subdirectory
     */
    public String storeFile(MultipartFile file, String subDirectory, String filename) {
        try {
            // Create the directory if it doesn't exist
            Path targetLocation = Paths.get(uploadDir, subDirectory).toAbsolutePath().normalize();

            logger.info("Storing file '{}' in directory: {}", filename, targetLocation);

            System.out.println("Upload directory from properties: " + uploadDir);
            System.out.println("Target location absolute path: " + targetLocation.toString());

            if (!Files.exists(targetLocation)) {
                logger.info("Creating directory: {}", targetLocation);
                Files.createDirectories(targetLocation);
            }

            // Clean the filename
            filename = StringUtils.cleanPath(filename);
            logger.debug("Cleaned filename: {}", filename);

            // Check if the file's name contains invalid characters
            if (filename.contains("..")) {
                logger.error("Filename contains invalid path sequence: {}", filename);
                throw new FileStorageException("Filename contains invalid path sequence: " + filename);
            }

            // Check if file is empty
            if (file.isEmpty()) {
                logger.error("Failed to store empty file: {}", filename);
                throw new FileStorageException("Failed to store empty file: " + filename);
            }

            // Copy file to the target location
            Path targetPath = targetLocation.resolve(filename);
            logger.debug("Target path: {}", targetPath);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("File stored successfully: {}", targetPath);

            System.out.println("File stored at: " + targetPath.toAbsolutePath().toString());
            System.out.println("File exists after storage: " + Files.exists(targetPath));
            System.out.println("File size: " + Files.size(targetPath));

            // Return the relative path
            String relativePath = subDirectory + "/" + filename;
            logger.debug("Returning relative path: {}", relativePath);
            return relativePath;

        } catch (IOException ex) {
            logger.error("Could not store file {}: {}", filename, ex.getMessage(), ex);
            throw new FileStorageException("Could not store file " + filename, ex);
        }
    }

    /**
     * Delete a file
     */
    public void deleteFile(String filePath) {
        try {
            Path targetPath = Paths.get(uploadDir, filePath).toAbsolutePath().normalize();
            logger.info("Deleting file: {}", targetPath);

            boolean deleted = Files.deleteIfExists(targetPath);
            if (deleted) {
                logger.info("File deleted successfully: {}", targetPath);
            } else {
                logger.warn("File not found for deletion: {}", targetPath);
            }
        } catch (IOException ex) {
            logger.error("Could not delete file: {}: {}", filePath, ex.getMessage(), ex);
            throw new FileStorageException("Could not delete file: " + filePath, ex);
        }
    }
}