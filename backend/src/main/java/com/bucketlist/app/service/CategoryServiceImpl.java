package com.bucketlist.app.service;

import com.bucketlist.app.domain.Category;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.CategoryRequest;
import com.bucketlist.app.dto.CategoryResponse;
import com.bucketlist.app.repository.jpa.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse create(User user, CategoryRequest request) {

        // 카테고리 이름 중복 확인
        if (categoryRepository.existsByUserAndName(user, request.getName())) {
            throw new RuntimeException("이미 존재하는 카테고리입니다.");
        }

        Category category = Category.builder()
                .name(request.getName())
                .color(request.getColor())
                .user(user)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories(User user) {
        List<Category> categories = categoryRepository.findByUserOrderByIdDesc(user);
        return categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse update(User user, Long categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        // 사용자 권한 확인
        if (!category.getUser().equals(user)) {
            throw new RuntimeException("해당 카테고리에 접근할 권한이 없습니다.");
        }

        // 다른 카테고리와 이름 중복 확인 (자신 제외)
        if (!category.getName().equals(request.getName()) && 
            categoryRepository.existsByUserAndName(user, request.getName())) {
            throw new RuntimeException("이미 존재하는 카테고리 이름입니다.");
        }

        category.setName(request.getName());
        category.setColor(request.getColor());

        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }

    @Override
    public void delete(User user, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        // 사용자 권한 확인
        if (!category.getUser().equals(user)) {
            throw new RuntimeException("해당 카테고리에 접근할 권한이 없습니다.");
        }

        // 카테고리에 속한 버킷리스트 항목이 있는지 확인
        if (!category.getBucketItems().isEmpty()) {
            throw new RuntimeException("해당 카테고리에 속한 버킷리스트 항목이 있어 삭제할 수 없습니다.");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        long itemCount = categoryRepository.countBucketItemsByCategoryId(category.getId());
        
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .itemCount((int) itemCount)
                .build();
    }
} 