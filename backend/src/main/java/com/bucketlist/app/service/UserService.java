package com.bucketlist.app.service;

import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.UserPasswordResetRequest;
import com.bucketlist.app.dto.UserSignupRequest;
import com.bucketlist.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;

    public void signup(UserSignupRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role("USER")
                .build();
        userRepository.save(user);
    }

    public void resetPassword(UserPasswordResetRequest request){
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
    
        user.setPassword(passwordEncoder.encode(passwordResetService.generateTempPassword()));
        passwordResetService.sendPasswordResetEmail(request.getEmail(), passwordResetService.generateTempPassword());
        userRepository.save(user);
    }
}