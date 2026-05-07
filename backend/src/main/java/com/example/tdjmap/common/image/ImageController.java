package com.example.tdjmap.common.image;

import com.example.tdjmap.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    /**
     * POST /images/upload?domain=stores|brands|menus|posts|diet|users|reviews
     * Content-Type: multipart/form-data
     * 파라미터: file (이미지 파일)
     * 응답: { imageUrl: "http://localhost:8080/images/{domain}/{uuid}.jpg" }
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ImageUploadResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("domain") String domain) {
        String imageUrl = imageService.upload(file, domain);
        return ResponseEntity.ok(ApiResponse.ok(new ImageUploadResponse(imageUrl)));
    }
}
