package com.bucketlist.app.service;

import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

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

    // 버킷 항목 완료 처리
    void complete(Long id);

    // 버킷 항목 미완료 처리
    void uncomplete(Long id);

    // 버킷 항목 파일 업로드
    String uploadFile(Long id, MultipartFile file, String email);

    // 버킷 항목 파일 삭제
    void deleteFile(Long id, Long fileId, String email);

    // 카테고리별 버킷리스트 항목 조회
    List<BucketItemResponse> getBucketItemsByCategory(String email, Long categoryId);
}
