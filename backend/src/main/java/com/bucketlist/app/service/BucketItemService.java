package com.bucketlist.app.service;

import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BucketItemService {
    // 버킷 리스트 항목 생성
    BucketItemResponse create(String email, BucketItemRequest request);


    //해당 사용자의 버킷 리스트 항목 조회
    List<BucketItemResponse> getAllBucketItems(String email);
    List<BucketItemResponse> getCompletedBucketItems(String email);
    List<BucketItemResponse> getIncompleteBucketItems(String email);


    // 버킷 항목 수정
    void update(Long id, BucketItemRequest request);

    // 버킷 항목 삭제
    void delete(Long id);

    String uploadFile(Long id, MultipartFile file, String email);
}
