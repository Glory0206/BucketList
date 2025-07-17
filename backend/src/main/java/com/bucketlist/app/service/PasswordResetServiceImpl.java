package com.bucketlist.app.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {
    private final JavaMailSender mailSender;

    @Override
    public String generateTempPassword() {// 임시 비밀번호 생성
        return UUID.randomUUID().toString().substring(0, 10);
    }

    @Override
    public void sendPasswordResetEmail(String email, String tempPassword){// 임시 비밀번호 이메일 발송송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom("dmb5627@naver.com");
        message.setSubject("임시 비밀번호 발급");
        message.setText("임시 비밀번호: " + tempPassword);
        mailSender.send(message);
    }
}
