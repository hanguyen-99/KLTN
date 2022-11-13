package com.document.manager.domain;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.AUTO;

@Entity
@Table(name = "document", indexes = {
        @Index(name = "index_title", columnList = "title"),
        @Index(name = "index_note", columnList = "note"),
        @Index(name = "index_file_name", columnList = "file_name"),
        @Index(name = "index_link", columnList = "link"),
        @Index(name = "index_created_stamp", columnList = "created_stamp"),
        @Index(name = "index_created_id", columnList = "created_id"),
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentApp implements Serializable {

    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;

    private String title;
    private String note;

    @Column(name = "file_name")
    private String fileName;
    private String link;

    @Column(name = "created_stamp")
    private Date createdStamp;

    @Column(name = "modified_stamp")
    private Date modifiedStamp;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "created_id")
    private UserApp userApp;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "document_id")
    private List<Sentences> sentences;

}
