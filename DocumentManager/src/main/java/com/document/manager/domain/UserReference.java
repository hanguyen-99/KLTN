package com.document.manager.domain;

import com.document.manager.dto.enums.ReferenceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

import static javax.persistence.FetchType.LAZY;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_reference")
public class UserReference implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private UserApp userApp;

    private String uuid;

    @Column(name = "created_stamp")
    private Date createdStamp;

    @Column(name = "expired_stamp")
    private Date expiredStamp;

    @Enumerated(EnumType.STRING)
    private ReferenceType type;
}
