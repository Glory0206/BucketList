package com.bucketlist.app.repository;

import com.bucketlist.app.domain.Category;
import com.bucketlist.app.domain.BucketItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // 사용자별 카테고리 조회 (ID 역순 = 최근 생성순)
    List<Category> findByUserEmailOrderByIdDesc(String email);
    
    // 사용자별 카테고리 이름으로 조회
    Optional<Category> findByUserEmailAndName(String email, String name);
    
    // 사용자별 카테고리 존재 여부 확인
    boolean existsByUserEmailAndName(String email, String name);
    
    // 사용자별 카테고리 개수 조회
    long countByUserEmail(String email);
    
    // 카테고리별 버킷리스트 항목 개수 조회
    @Query("SELECT COUNT(bi) FROM BucketItem bi WHERE bi.category.id = :categoryId")
    long countBucketItemsByCategoryId(@Param("categoryId") Long categoryId);
}