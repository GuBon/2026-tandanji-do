package com.example.tdjmap.user.controller;

import com.example.tdjmap.common.ApiResponse;
import com.example.tdjmap.user.dto.UserResponse;
import com.example.tdjmap.user.dto.UserUpdateRequest;
import com.example.tdjmap.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getMe()));
    }

    @PutMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
            @RequestBody @Valid UserUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(userService.updateMe(req)));
    }
}
