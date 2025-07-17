package com.bucketlist.app.service;

import com.bucketlist.app.dto.CodeVerifyRequest;

public interface ResetPasswordService {
    String createRandomCode();

    void sendCode(String email);

    boolean resetPassword(CodeVerifyRequest request);
}
