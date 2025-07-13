package com.bucketlist.app.service;

import com.bucketlist.app.domain.BucketItem;
import com.bucketlist.app.domain.User;
import com.bucketlist.app.dto.BucketItemRequest;
import com.bucketlist.app.dto.BucketItemResponse;
import com.bucketlist.app.repository.BucketItemRepository;
import com.bucketlist.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BucketItemService {
    private final UserRepository userRepository;
    private final BucketItemRepository bucketItemRepository;

    public void create(String email, BucketItemRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        BucketItem item = BucketItem.builder()
                .content(request.getContent())
                .completed(false)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        bucketItemRepository.save(item);
    }

    public List<BucketItemResponse> getList(String email){
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

    public void update(Long id, BucketItemRequest request){
        BucketItem item = bucketItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("항목 없음"));

        item.setContent(request.getContent());
        item.setDueDate(request.getDueDate());
        bucketItemRepository.save(item);
    }
    
    public void delete(Long id){
        bucketItemRepository.deleteById(id);
    }
}
