package com.chorepay.backend.progress;

import com.chorepay.backend.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressService userProgressService;

    public UserProgressController(
            UserProgressService userProgressService
    ) {
        this.userProgressService = userProgressService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProgressResponse> getMyProgress(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                userProgressService.getMyProgress(user)
        );
    }

    @GetMapping("/family")
public ResponseEntity<List<FamilyChildProgressResponse>> getFamilyProgress(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            userProgressService.getFamilyProgress(user)
    );
}
}