package com.document.manager.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class RateAppDTO implements Serializable {

    @NotNull
    private Double rate;

    @NotNull
    private String type;
}
