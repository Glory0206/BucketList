package com.bucketlist.app.service;

import com.bucketlist.app.dto.UserSignupRequest;
import com.bucketlist.app.dto.UserPasswordResetRequest;

public interface UserService {
    void signup(UserSignupRequest request);
    void resetPassword(UserPasswordResetRequest request);
}