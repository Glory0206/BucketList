package com.bucketlist.app.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class BucketItemResponse {
    private Long id;
    private String content;
    private boolean completed;
    private LocalDate dueDate;
}
