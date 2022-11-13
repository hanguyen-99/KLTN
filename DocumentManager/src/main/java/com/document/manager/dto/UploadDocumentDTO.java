package com.document.manager.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class UploadDocumentDTO implements Serializable {

    @NotNull
    private String title;

    private String note;

    @NotNull
    private MultipartFile multipartFile;
}
