package com.bucketlist.app.service;

import com.bucketlist.app.dto.ResetPasswordRequest;

public interface ResetPasswordService {
    String createRandomCode();

    void sendCode(String email);

    boolean resetPassword(ResetPasswordRequest request);
}
