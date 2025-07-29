package com.bucketlist.app.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class BucketItemRequest {
    private String content;
    private LocalDate dueDate;
    private Long categoryId;
}
