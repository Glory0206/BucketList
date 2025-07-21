package com.bucketlist.app.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileUploadResponse {
    private Long id;
    private String fileName;
    private String fileUrl;
}
