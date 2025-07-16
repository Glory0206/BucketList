package com.bucketlist.app.service;

public interface PasswordResetService {
    // 임시 비밀번호 생성
    String generateTempPassword();

    // 임시 비밀번호 전송
    void sendPasswordResetEmail(String email, String tempPassword);
}
