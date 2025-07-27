package com.bucketlist.app.controller;

import com.bucketlist.app.dto.UserLoginRequest;
import com.bucketlist.app.dto.ResetPasswordRequest;
import com.bucketlist.app.dto.CreatePasswordCordRequest;
import com.bucketlist.app.dto.UserSignupRequest;
import com.bucketlist.app.service.ResetPasswordService;
import com.bucketlist.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // final 선언된 필드 자동 생성자 주입
public class AuthController {
    private final UserService userService;
    private final ResetPasswordService resetPasswordService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserSignupRequest request){
        userService.signup(request);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequest request){
        return ResponseEntity.ok().body(userService.login(request));
    }

    @PostMapping("/create-code")
    public ResponseEntity<?> createCode(@RequestBody @Valid CreatePasswordCordRequest request){
        resetPasswordService.sendCode(request.getEmail());
        return ResponseEntity.ok("코드가 이메일로 전송되었습니다.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request){
        boolean result = resetPasswordService.resetPassword(request);
        if(result){
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("비밀번호 변경에 실패했습니다.");
        }
    }
}
