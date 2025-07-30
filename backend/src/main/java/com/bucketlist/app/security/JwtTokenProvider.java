package com.bucketlist.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final String secretKey;
    private final long validityInMs = 60 * 15 * 1000L; // Access Token 유효시간: 15분
    private final long refreshValidityInMs = 7 * 24 * 60 * 60 * 1000L; // Refresh Token 유효시간: 7일
    private final Key key;

    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey) {
        this.secretKey = secretKey;
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    private String generateToken(String email, long validity){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validity);

        return Jwts.builder()
                .setSubject(email) // email을 식별자로 사용
                .setIssuedAt(now) // 발급 시간
                .setExpiration(expiry) // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 토큰 생성 시 사용할 키
                .compact(); // JWT 문자열 생성
    }

    // Access Token 생성
    private String createToken(String email){
        return generateToken(email, validityInMs);
    }

    // Refresh Token 생성
    public String createRefreshToken(String email) {
        return generateToken(email, refreshValidityInMs);
    }

    // 토큰에서 이메일 추출
    public String getEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰 유효 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build()//토큰 검증
                    .parseClaimsJws(token);//토큰 파싱
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
