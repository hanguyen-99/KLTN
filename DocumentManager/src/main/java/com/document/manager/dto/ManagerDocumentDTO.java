package com.document.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManagerDocumentDTO implements Serializable {

    private Long documentId;
    private String title;
    private String note;
    private Date createdStamp;
    private String author;
}
