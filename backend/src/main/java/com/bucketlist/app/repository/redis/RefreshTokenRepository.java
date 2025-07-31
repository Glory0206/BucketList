package com.bucketlist.app.repository.redis;

import com.bucketlist.app.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
