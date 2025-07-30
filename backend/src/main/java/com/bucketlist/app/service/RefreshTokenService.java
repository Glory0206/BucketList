package com.bucketlist.app.service;

public interface RefreshTokenService {
    // Refresh Token 저장 또는 갱신
    void save(String email, String token);

    // 저장된 Refresh Token과 전달된 토큰이 일치하는지 확인
    boolean isValid(String email, String token);

    // Refresh Token 정보 삭제
    void delete(String email);
}
