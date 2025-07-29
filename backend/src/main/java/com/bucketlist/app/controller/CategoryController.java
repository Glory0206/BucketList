package com.bucketlist.app.controller;

import com.bucketlist.app.dto.CategoryRequest;
import com.bucketlist.app.dto.CategoryResponse;
import com.bucketlist.app.repository.UserRepository;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    private final UserRepository userRepository;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    // 카테고리 생성
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(categoryService.create(user, request));
    }

    // 사용자별 모든 카테고리 조회
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        User user = getCurrentUser();
        return ResponseEntity.ok(categoryService.getAllCategories(user));
    }

    // 카테고리 수정
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @RequestBody CategoryRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(categoryService.update(user, id, request));
    }

    // 카테고리 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User user = getCurrentUser();
        categoryService.delete(user, id);
        return ResponseEntity.ok("카테고리가 삭제되었습니다.");
    }

} 