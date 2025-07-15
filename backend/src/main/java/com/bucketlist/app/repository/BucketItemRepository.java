package com.bucketlist.app.repository;

import com.bucketlist.app.domain.User;
import com.bucketlist.app.domain.BucketItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BucketItemRepository extends JpaRepository<BucketItem, Long> {
    List<BucketItem> findByUser(User user);
    List<BucketItem> findByUserAndCompleted(User user, boolean completed);
}
