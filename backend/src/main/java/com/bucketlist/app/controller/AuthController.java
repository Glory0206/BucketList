package com.bucketlist.app.controller;

import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.UserLoginRequest;
import com.bucketlist.app.dto.UserPasswordResetRequest;
import com.bucketlist.app.dto.UserSignupRequest;
import com.bucketlist.app.repository.UserRepository;
import com.bucketlist.app.security.JwtTokenProvider;
import com.bucketlist.app.service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // final 선언된 필드 자동 생성자 주입
public class AuthController {
    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserSignupRequest request){
        userService.signup(request);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(user.getEmail());

        // 토큰과 닉네임 정보를 함께 응답
        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "token", token,
                        "nickname", user.getNickname()
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid UserPasswordResetRequest request){
        userService.resetPassword(request);
        return ResponseEntity.ok("임시 비밀번호가 이메일로 전송되었습니다.");
    }
}
