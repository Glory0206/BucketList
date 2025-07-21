package com.bucketlist.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 잘못된 요청(IllegalArgumentException 등)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        ex.printStackTrace();// 로그 추가
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 유효성 검사 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        ex.printStackTrace();
        String errorMsg = ex.getBindingResult().getFieldError() != null ?
                ex.getBindingResult().getFieldError().getDefaultMessage() :
                "잘못된 요청입니다.";
        return buildResponse(HttpStatus.BAD_REQUEST, errorMsg);
    }

    // 런타임 예외 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
        ex.printStackTrace();
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // 그 외 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        ex.printStackTrace();
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");
    }

    // 응답 형식 정의
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", message);
        body.put("status", status.value());
        body.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(body, status);
    }
} 