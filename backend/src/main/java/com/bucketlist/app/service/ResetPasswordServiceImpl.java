package com.bucketlist.app.service;

import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResetPasswordServiceImpl implements ResetPasswordService {
    private final JavaMailSender mailSender;

    @Override
        public String createRandomCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            char c = (char) ('A' + (int)(Math.random() * 26));
            sb.append(c);
        }
        return sb.toString();
    }

    @Override
    public void sendCode(String email){
        String code = createRandomCode();
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setFrom("dmb5627@naver.com");
        message.setSubject("코드 발급");
        message.setText("코드: " + code);
        mailSender.send(message);
    }
}
