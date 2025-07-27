package com.bucketlist.app.service;

import com.bucketlist.app.dto.UserLoginRequest;
import com.bucketlist.app.dto.UserLoginResponse;
import com.bucketlist.app.dto.UserSignupRequest;

public interface UserService {
    void signup(UserSignupRequest request);
    UserLoginResponse login(UserLoginRequest request);
}