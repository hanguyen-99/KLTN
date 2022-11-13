package com.document.manager.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class IndexDTO implements Serializable {

    private Integer startTarget;
    private Integer startMatching;
    private Integer length;
}
