package com.bucketlist.app.service;

import com.bucketlist.app.dto.CategoryRequest;
import com.bucketlist.app.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    
    // 카테고리 생성
    CategoryResponse create(String email, CategoryRequest request);
    
    // 사용자별 모든 카테고리 조회
    List<CategoryResponse> getAllCategories(String email);
    
    // 카테고리 수정
    CategoryResponse update(String email, Long categoryId, CategoryRequest request);
    
    // 카테고리 삭제
    void delete(String email, Long categoryId);
    
} 