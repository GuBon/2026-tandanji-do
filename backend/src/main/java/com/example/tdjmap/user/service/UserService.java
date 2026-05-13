package com.example.tdjmap.user.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.record.service.WeightLogService;
import com.example.tdjmap.repository.UserRepository;
import com.example.tdjmap.user.dto.UserResponse;
import com.example.tdjmap.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final WeightLogService weightLogService;

    public UserResponse getMe() {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = findUserOrThrow(userId);
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateMe(UserUpdateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = findUserOrThrow(userId);
        if (req.getNickname() != null) user.setNickname(req.getNickname());
        if (req.getHeight() != null) user.setHeight(req.getHeight());
        if (req.getWeight() != null) {
            user.setWeight(req.getWeight());
            weightLogService.createLog(user, req.getWeight().doubleValue());
        }
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getAge() != null) user.setAge(req.getAge());
        return UserResponse.from(user);
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
