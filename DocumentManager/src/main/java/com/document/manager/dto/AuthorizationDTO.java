package com.document.manager.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class AuthorizationDTO {

    @NotBlank(message = "Authorization is mandatory")
    private String authorization;
}
