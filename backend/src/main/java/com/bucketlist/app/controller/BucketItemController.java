package com.bucketlist.app.controller;


import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.service.BucketItemService;
import com.bucketlist.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bucket")
@RequiredArgsConstructor
public class BucketItemController {
    private final BucketItemService bucketItemService;
    private final UserRepository userRepository;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();    
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    @PostMapping
    public ResponseEntity<BucketItemResponse> create(@RequestBody BucketItemRequest request){
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.create(user, request));
    }

    @GetMapping
    public ResponseEntity<List<BucketItemResponse>> getAllBucketItems(){
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.getAllBucketItems(user));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<BucketItemResponse>> getCompletedBucketItems(){
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.getCompletedBucketItems(user));
    }

    @GetMapping("/incompleted")
    public ResponseEntity<List<BucketItemResponse>> getIncompletedBucketItems(){
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.getIncompleteBucketItems(user));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BucketItemResponse>> getBucketItemsByCategory(@PathVariable Long categoryId){
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.getBucketItemsByCategory(user, categoryId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BucketItemRequest request){
        bucketItemService.update(id, request);
        return ResponseEntity.ok("수정 완료");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        bucketItemService.delete(id);
        return ResponseEntity.ok("삭제 완료");
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id){
        bucketItemService.complete(id);
        return ResponseEntity.ok("완료 처리 완료");
    }

    @PutMapping("/{id}/uncomplete")
    public ResponseEntity<?> uncomplete(@PathVariable Long id){
        bucketItemService.uncomplete(id);
        return ResponseEntity.ok("미완료 처리 완료");
    }

    @PostMapping("/bucket-item/{id}/file")
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file){  
        User user = getCurrentUser();
        return ResponseEntity.ok(bucketItemService.uploadFile(id, file, user));
    }

    @DeleteMapping("/bucket-item/{id}/file/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id, @PathVariable Long fileId){
        User user = getCurrentUser();
        bucketItemService.deleteFile(id, fileId, user);
        return ResponseEntity.ok("파일 삭제 완료");
    }
}
