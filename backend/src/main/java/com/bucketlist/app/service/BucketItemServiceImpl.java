package com.bucketlist.app.service;

import com.bucketlist.app.domain.BucketItem;
import com.bucketlist.app.domain.Category;
import com.bucketlist.app.domain.FileUpload;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.dto.CategoryResponse;
import com.bucketlist.app.dto.FileUploadResponse;
import com.bucketlist.app.repository.jpa.BucketItemRepository;
import com.bucketlist.app.repository.jpa.CategoryRepository;
import com.bucketlist.app.repository.jpa.FileUploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class BucketItemServiceImpl implements BucketItemService{
    private final BucketItemRepository bucketItemRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadRepository fileUploadRepository;
    private final String uploadDir = System.getProperty("user.dir") + "/../uploads";

    @Override
    public BucketItemResponse create(User user, BucketItemRequest request){// 버킷 리스트 항목 생성

        BucketItem item = BucketItem.builder()
                .content(request.getContent())
                .completed(false)
                .dueDate(request.getDueDate())
                .user(user)
                .createdAt(LocalDateTime.now())
                .files(new ArrayList<>())
                .category(categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리 없음")))
                .build();

        bucketItemRepository.save(item);

        return convertToResponse(item);
    }

    @Override
    public List<BucketItemResponse> getAllBucketItems(User user){// 해당 사용자의 버킷 리스트 항목 조회

        return bucketItemRepository.findByUser(user).stream() // steam: 리스트 반복 처리
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BucketItemResponse> getCompletedBucketItems(User user){// 해당 사용자의 완료된 버킷 리스트 항목 조회

        return bucketItemRepository.findByUserAndCompleted(user, true).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BucketItemResponse> getIncompleteBucketItems(User user){// 해당 사용자의 미완료된 버킷 리스트 항목 조회

        return bucketItemRepository.findByUserAndCompleted(user, false).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void update(Long id, BucketItemRequest request){// 버킷 항목 수정
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));

        item.setContent(request.getContent());
        item.setDueDate(request.getDueDate()); 
        item.setCategory(categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리 없음")));
        bucketItemRepository.save(item);
    }
    
    @Override
    public void delete(Long id){// 버킷 항목 삭제
        bucketItemRepository.deleteById(id);
    }

    @Override
    public void complete(Long id){// 버킷 항목 완료 처리
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));
        
        item.setCompleted(true);
        item.setCompletedAt(LocalDateTime.now());
        bucketItemRepository.save(item);
    }

    @Override
    public void uncomplete(Long id){// 버킷 항목 미완료 처리
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));
        
        item.setCompleted(false);
        item.setCompletedAt(null);
        bucketItemRepository.save(item);
    }

    @Override
    public String uploadFile(Long id, MultipartFile file, User user){// 버킷 항목 파일 업로드
        
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));

        // 파일명 중복 방지 (UUID 사용)
        String originalFileName = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + "_" + originalFileName;

        File dir = new File(uploadDir);
        if(!dir.exists()){
            dir.mkdirs();
        }

        String filePath = uploadDir + "/" + fileName;
        String fileUrl = "/uploads/" + fileName;
        File dest = new File(filePath);

        try{
            file.transferTo(dest);
        }catch(IOException e){
            throw new RuntimeException("파일 업로드 실패", e);
        }

        FileUpload fileUpload = new FileUpload();
        fileUpload.setFileName(fileName);
        fileUpload.setFileUrl(fileUrl); // <-- HTTP 접근 경로로 저장
        fileUpload.setBucketItem(item);

        fileUploadRepository.save(fileUpload);

        return fileUrl;
    }

    @Override
    public void deleteFile(Long id, Long fileId, User user){// 버킷 항목 파일 삭제
        
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));

        FileUpload fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        String filePath = System.getProperty("user.dir") + "/../uploads/" + fileUpload.getFileName();
        if(filePath != null){
            File file = new File(filePath);
            if(file.exists()){
                file.delete();
            }
        }

        fileUploadRepository.delete(fileUpload);
    }

    @Override
    public List<BucketItemResponse> getBucketItemsByCategory(User user, Long categoryId) {

        // 카테고리 존재 및 권한 확인
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        return bucketItemRepository.findByUserAndCategory(user, category).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BucketItemResponse convertToResponse(BucketItem item) {
        CategoryResponse categoryInfo = null;
        if (item.getCategory() != null) {
            categoryInfo = CategoryResponse.builder()
                    .id(item.getCategory().getId())
                    .name(item.getCategory().getName())
                    .color(item.getCategory().getColor())
                    .build();
        }
    
        return BucketItemResponse.builder()
                .id(item.getId())
                .content(item.getContent())
                .completed(item.isCompleted())
                .dueDate(item.getDueDate())
                .createdAt(item.getCreatedAt())
                .completedAt(item.getCompletedAt())
                .category(categoryInfo)
                .files(item.getFiles().stream()
                        .map(file -> FileUploadResponse.builder()
                                .id(file.getId())
                                .fileName(file.getFileName())
                                .fileUrl(file.getFileUrl())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
