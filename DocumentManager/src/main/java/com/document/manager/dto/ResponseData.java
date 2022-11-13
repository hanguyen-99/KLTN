package com.document.manager.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ResponseData {
    private String status;
    private String message;
    private Object data;
}
