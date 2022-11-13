package com.document.manager.repository;

import com.document.manager.domain.DocumentApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DocumentRepo extends JpaRepository<DocumentApp, Long> {

    @Query(value = "SELECT d.* FROM document d WHERE d.created_id =:userId", nativeQuery = true)
    List<DocumentApp> findByUserId(Long userId);

    long count();

    void delete(DocumentApp documentApp);

    @Query(value = "SELECT d.* FROM document d WHERE d.id = :documentId AND d.created_id =:userId", nativeQuery = true)
    Optional<DocumentApp> findByDocumentIdAndUserId(Long documentId, Long userId);
}
