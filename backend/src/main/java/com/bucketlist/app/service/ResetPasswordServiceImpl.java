package com.bucketlist.app.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.bucketlist.app.domain.User;
import com.bucketlist.app.repository.UserRepository;
import com.bucketlist.app.dto.CodeVerifyRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResetPasswordServiceImpl implements ResetPasswordService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Map<String, String> emailToCodeStore = new ConcurrentHashMap<>();
    private static final Map<String, String> codeToEmailStore = new ConcurrentHashMap<>();

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

        // 코드 저장 (이메일 <-> 코드 양방향 저장)
        emailToCodeStore.put(email, code);
        codeToEmailStore.put(code, email);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom("dmb5627@naver.com");
        message.setSubject("코드 발급");
        message.setText("코드: " + code);
        mailSender.send(message);
    }

    @Override
    public boolean resetPassword(CodeVerifyRequest request){

        String email = codeToEmailStore.get(request.getCode());

        if (email == null) {
            throw new IllegalArgumentException("유효하지 않은 코드입니다.");
        }

        // 이메일에 저장된 코드와 입력된 코드가 일치하는지 비교
        String storedCode = emailToCodeStore.get(email);
        if (storedCode == null || !storedCode.equals(request.getCode())) {
            throw new IllegalArgumentException("코드가 일치하지 않습니다.");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // 사용한 코드 정보 삭제
        emailToCodeStore.remove(email);
        codeToEmailStore.remove(request.getCode());

        return true;
    }
}
