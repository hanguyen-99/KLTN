package com.document.manager.domain;

import com.document.manager.dto.enums.RateType;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "rate")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RateApp implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private Double rate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RateType type;
}
