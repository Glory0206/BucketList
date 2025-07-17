package com.bucketlist.app.controller;

import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.service.BucketItemService;
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

    @PostMapping
    public ResponseEntity<BucketItemResponse> create(@RequestBody BucketItemRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemService.create(email, request));
    }

    @GetMapping
    public ResponseEntity<List<BucketItemResponse>> getAllBucketItems(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemService.getAllBucketItems(email));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<BucketItemResponse>> getCompletedBucketItems(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemService.getCompletedBucketItems(email));
    }

    @GetMapping("/incompleted")
    public ResponseEntity<List<BucketItemResponse>> getIncompletedBucketItems(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemService.getIncompleteBucketItems(email));
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

    @PostMapping("/bucket-item/{id}/file")
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file){  
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bucketItemService.uploadFile(id, file, email));
    }
}
