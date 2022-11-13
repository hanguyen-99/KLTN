package com.document.manager.domain;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "sentences", indexes = {
        @Index(name = "index_document_id", columnList = "document_id"),
        @Index(name = "index_raw_text", columnList = "raw_text"),
        @Index(name = "index_tokenizers", columnList = "tokenizer")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sentences implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private DocumentApp documentApp;

    @Column(name = "raw_text", columnDefinition = "text")
    private String rawText;

    @Column(columnDefinition = "text")
    private String tokenizer;
}
