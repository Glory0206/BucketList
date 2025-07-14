package com.bucketlist.app.controller;

import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.service.BucketItemServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bucket")
@RequiredArgsConstructor
public class BucketItemController {
    private final BucketItemServiceImpl bucketItemServiceImpl;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BucketItemRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        bucketItemServiceImpl.create(email, request);
        return ResponseEntity.ok("등록 완료");
    }

    @GetMapping
    public ResponseEntity<List<BucketItemResponse>> getAll(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemServiceImpl.getAllBucketItems(email));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<BucketItemResponse>> getCompletedBucketItems(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemServiceImpl.getCompletedBucketItems(email));
    }

    @GetMapping("/incompleted")
    public ResponseEntity<List<BucketItemResponse>> getIncompletedBucketItems(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemServiceImpl.getIncompleteBucketItems(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BucketItemRequest request){
        bucketItemServiceImpl.update(id, request);
        return ResponseEntity.ok("수정 완료");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        bucketItemServiceImpl.delete(id);
        return ResponseEntity.ok("삭제 완료");
    }
}
