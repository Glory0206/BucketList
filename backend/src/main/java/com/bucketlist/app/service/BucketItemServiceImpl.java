package com.bucketlist.app.service;

import com.bucketlist.app.domain.BucketItem;
import com.bucketlist.app.domain.FileUpload;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.repository.BucketItemRepository;
import com.bucketlist.app.repository.FileUploadRepository;
import com.bucketlist.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BucketItemServiceImpl implements BucketItemService{
    private final UserRepository userRepository;
    private final BucketItemRepository bucketItemRepository;
    private final FileUploadRepository fileUploadRepository;
    private final String uploadDir = System.getProperty("user.dir") + "/uploads";

    @Override
    public BucketItemResponse create(String email, BucketItemRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        BucketItem item = BucketItem.builder()
                .content(request.getContent())
                .completed(false)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        bucketItemRepository.save(item);

        return BucketItemResponse.builder()
                .id(item.getId())
                .content(item.getContent())
                .completed(item.isCompleted())
                .dueDate(item.getDueDate())
                .build();
    }

    @Override
    public List<BucketItemResponse> getAllBucketItems(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        return bucketItemRepository.findByUser(user).stream() // steam: 리스트 반복 처리
                .map(item -> BucketItemResponse.builder()
                        .id(item.getId())
                        .content(item.getContent())
                        .completed(item.isCompleted())
                        .dueDate(item.getDueDate())
                        .build())
                .toList();
    }

    @Override
    public List<BucketItemResponse> getCompletedBucketItems(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        return bucketItemRepository.findByUserAndCompleted(user, true).stream()
                .map(item -> BucketItemResponse.builder()
                        .id(item.getId())
                        .content(item.getContent())
                        .completed(item.isCompleted())
                        .dueDate(item.getDueDate())
                        .build())
                .toList();
    }

    @Override
    public List<BucketItemResponse> getIncompleteBucketItems(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        return bucketItemRepository.findByUserAndCompleted(user, false).stream()
                .map(item -> BucketItemResponse.builder()
                        .id(item.getId())
                        .content(item.getContent())
                        .completed(item.isCompleted())
                        .dueDate(item.getDueDate())
                        .build())
                .toList();
    }

    @Override
    public void update(Long id, BucketItemRequest request){
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));

        item.setContent(request.getContent());
        item.setDueDate(request.getDueDate());
        bucketItemRepository.save(item);
    }
    
    @Override
    public void delete(Long id){
        bucketItemRepository.deleteById(id);
    }

    @Override
    public String uploadFile(Long id, MultipartFile file, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        
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
        File dest = new File(filePath);

        try{
            file.transferTo(dest);
        }catch(IOException e){
            throw new RuntimeException("파일 업로드 실패", e);
        }

        FileUpload fileUpload = new FileUpload();
        fileUpload.setFileName(fileName);
        fileUpload.setFileUrl(filePath);
        fileUpload.setBucketItem(item);

        fileUploadRepository.save(fileUpload);

        return filePath;
    }
}
