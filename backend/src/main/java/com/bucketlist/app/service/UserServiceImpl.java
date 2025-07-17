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
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;

    @Override
    public void signup(UserSignupRequest request){// 회원가입
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

    @Override
    public void resetPassword(UserPasswordResetRequest request){// 비밀번호 초기화
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
    
        String tempPassword = passwordResetService.generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        passwordResetService.sendPasswordResetEmail(request.getEmail(), tempPassword);
        userRepository.save(user);
    }
}