package com.bucketlist.app.service;

public interface ResetPasswordService {
    String createRandomCode();

    void sendCode(String email);
}
