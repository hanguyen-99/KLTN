package com.document.manager.service;

import com.document.manager.domain.DocumentApp;
import com.document.manager.dto.DocumentDTO;
import com.document.manager.dto.PlagiarismDocumentDTO;
import com.document.manager.dto.UpdateDocumentDTO;
import com.document.manager.dto.UploadDocumentDTO;
import javassist.NotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface DocumentService {

    DocumentApp save(DocumentApp documentApp);

    PlagiarismDocumentDTO uploadDocument(UploadDocumentDTO uploadDocumentDTO) throws IOException;

    String[] divisionToSentences(String content) throws Exception;

    List<DocumentApp> findByUserId(Long userId);

    List<DocumentApp> findAll();

    PlagiarismDocumentDTO getPlagiarism(String[] target, Map<Integer, List<String>> tokenizerOfTarget);

    List<DocumentDTO> getDocumentOfCurrentUser() ;

    long count();

    void delete(Long documentId) throws NotFoundException;

    void update(Long documentId, UpdateDocumentDTO updateDocumentDTO);

    DocumentDTO getDetailDocument(Long documentId) throws NotFoundException, IOException;
}
