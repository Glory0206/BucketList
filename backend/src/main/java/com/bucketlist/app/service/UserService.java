package com.bucketlist.app.service;

import com.bucketlist.app.dto.UserSignupRequest;

public interface UserService {
    void signup(UserSignupRequest request);
}