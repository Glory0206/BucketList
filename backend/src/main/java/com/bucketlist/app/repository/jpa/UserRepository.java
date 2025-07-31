package com.bucketlist.app.repository.jpa;

import com.bucketlist.app.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // email로 User 엔티티 조회
    boolean existsByEmail(String email); // DB에 존재하는지 여부 확인
}
