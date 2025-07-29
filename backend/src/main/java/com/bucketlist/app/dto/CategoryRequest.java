package com.bucketlist.app.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    
    @NonNull
    private String name;
    
    @NonNull
    private String color;
} 