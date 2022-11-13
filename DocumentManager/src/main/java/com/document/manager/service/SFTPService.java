package com.document.manager.service;


import com.document.manager.domain.DocumentApp;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface SFTPService {

    byte[] getFileFromSFTP(String path);

    Map<Long, byte[]> getDocumentsFromSFTP(List<DocumentApp> documentApps);

    String uploadFileToSFTP(String path, MultipartFile file);

    void deleteFile(String path);
}
