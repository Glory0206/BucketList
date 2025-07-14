package com.bucketlist.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequest {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size(min = 2, max = 15, message = "닉네임은 2자 이상 15자 이하로 입력해주세요.")
    @Pattern(regexp = "^[a-zA-Z0-9가-힣]{2,15}$", message = "닉네임은 영어, 한글, 숫자만 사용 가능하며 공백이나 기호는 사용할 수 없습니다.")
    private String nickname;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,15}$",
            message = "비밀번호는 8~15자이며 특수문자를 하나 이상 포함해야 합니다."
    )
    private String password;
}
