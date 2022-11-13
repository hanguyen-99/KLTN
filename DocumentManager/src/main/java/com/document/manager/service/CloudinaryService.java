package com.document.manager.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    String upload(MultipartFile file, String folderName);

    void delete(String public_id, String folderName);
}
