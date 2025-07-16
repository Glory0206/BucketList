package com.bucketlist.app.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "file_upload")
public class FileUpload{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "bucket_item_id", nullable = false)
    private BucketItem bucketItem;
}