package com.bucketlist.app.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "아이디를 입력해주세요.")
    @Column(nullable = false, unique = true)
    private String memberId;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "전화번호를 입력해주세요.")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Column(nullable = false)
    private String nickname;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,15}$",
            message = "비밀번호는 8~15자이며 특수문자를 하나 이상 포함해야 합니다."
    )
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private LocalDateTime registerDate;

    @PrePersist // DB에 저장되기 직전 실행
    public void setRegisterDate() {
        this.registerDate = LocalDateTime.now();
    }
}
