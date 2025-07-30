package com.bucketlist.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TokenReissueRequest {
    @NotBlank(message = "Access Token은 필수입니다.")
    private String accessToken;

    @NotBlank(message = "Refresh Token은 필수입니다.")
    private String refreshToken;
}
