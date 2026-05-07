package com.example.tdjmap.common.image;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageService {

    private static final Set<String> ALLOWED_DOMAINS =
            Set.of("stores", "brands", "menus", "posts", "diet", "users", "reviews", "reports");

    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private static final long MAX_SIZE = 10L * 1024 * 1024; // 10MB

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.image.base-url}")
    private String baseUrl;

    public String upload(MultipartFile file, String domain) {
        validateDomain(domain);
        validateFile(file);

        String ext = extractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;
        Path targetDir = Paths.get(uploadDir, domain);

        try {
            Files.createDirectories(targetDir);
            Files.copy(file.getInputStream(), targetDir.resolve(filename));
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }

        return baseUrl + domain + "/" + filename;
    }

    public void delete(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(baseUrl)) return;
        String relative = imageUrl.substring(baseUrl.length()); // "stores/uuid.jpg"
        Path target = Paths.get(uploadDir).resolve(relative);
        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
        }
    }

    private void validateDomain(String domain) {
        if (!ALLOWED_DOMAINS.contains(domain)) {
            throw new BusinessException(ErrorCode.IMAGE_INVALID_DOMAIN);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.IMAGE_EMPTY);
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BusinessException(ErrorCode.IMAGE_INVALID_TYPE);
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BusinessException(ErrorCode.IMAGE_TOO_LARGE);
        }
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
