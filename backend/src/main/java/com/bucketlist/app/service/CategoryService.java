package com.bucketlist.app.service;

import com.bucketlist.app.dto.CategoryRequest;
import com.bucketlist.app.dto.CategoryResponse;
import com.bucketlist.app.domain.User;

import java.util.List;

public interface CategoryService {
    
    // 카테고리 생성
    CategoryResponse create(User user, CategoryRequest request);
    
    // 사용자별 모든 카테고리 조회
    List<CategoryResponse> getAllCategories(User user);
    
    // 카테고리 수정
    CategoryResponse update(User user, Long categoryId, CategoryRequest request);
    
    // 카테고리 삭제
    void delete(User user, Long categoryId);
    
} 