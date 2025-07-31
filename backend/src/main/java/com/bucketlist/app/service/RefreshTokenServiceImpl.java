package com.bucketlist.app.service;

import com.bucketlist.app.domain.RefreshToken;
import com.bucketlist.app.repository.redis.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService{
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void save(String email, String token) {
        refreshTokenRepository.save(new RefreshToken(email, token));
    }

    @Override
    public boolean isValid(String email, String token) {
        return refreshTokenRepository.findById(email)
                .map(rt -> rt.getToken().equals(token))
                .orElse(false);
    }

    @Override
    public void delete(String email) {
        refreshTokenRepository.deleteById(email);
    }
}
