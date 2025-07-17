package com.bucketlist.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeVerifyRequest {
    @NotBlank(message = "코드를 입력해주세요.")
    private String code;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;
}
