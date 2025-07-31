package com.bucketlist.app.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bucketlist.app.domain.FileUpload;
import java.util.List;

public interface FileUploadRepository extends JpaRepository<FileUpload, Long>{
    List<FileUpload> findByBucketItemId(Long bucketItemId);
    void deleteByBucketItemId(Long bucketItemId);
}
