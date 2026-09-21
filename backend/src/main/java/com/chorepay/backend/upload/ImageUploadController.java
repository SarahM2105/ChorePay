package com.chorepay.backend.upload;

import com.chorepay.backend.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(
            ImageUploadService imageUploadService
    ) {
        this.imageUploadService =
                imageUploadService;
    }

    @PostMapping("/chore-proof")
    public ResponseEntity<Map<String, String>>
    uploadChoreProof(
            @AuthenticationPrincipal User user,
            @RequestParam("file")
            MultipartFile file
    ) {
        String imageUrl =
                imageUploadService
                        .uploadChoreProof(file);

        return ResponseEntity.ok(
                Map.of(
                        "url",
                        imageUrl
                )
        );
    }
}