package com.example.tdjmap.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final int status;
    private final T data;
    private final String message;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, data, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(201, data, null);
    }

    public static ApiResponse<Void> error(int status, String message) {
        return new ApiResponse<>(status, null, message);
    }
}
