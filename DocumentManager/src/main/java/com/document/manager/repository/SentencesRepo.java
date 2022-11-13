package com.document.manager.repository;

import com.document.manager.domain.Sentences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SentencesRepo extends JpaRepository<Sentences, Long> {

    @Query(value = "select s.* from sentences s where s.document_id=:documentId", nativeQuery = true)
    List<Sentences> findByDocumentId(Long documentId);
}
