package com.chorepay.backend.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadService(
            Cloudinary cloudinary
    ) {
        this.cloudinary = cloudinary;
    }

    public String uploadChoreProof(
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Image file is required."
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null
                || !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed."
            );
        }

        try {
            Map<?, ?> result =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "folder",
                                    "chorepay/chore-proofs"
                            )
                    );

            Object secureUrl =
                    result.get("secure_url");

            if (secureUrl == null) {
                throw new IllegalStateException(
                        "Cloudinary did not return an image URL."
                );
            }

            return secureUrl.toString();

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not upload image.",
                    exception
            );
        }
    }
}