package com.document.manager.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
public class ResetPasswordDTO implements Serializable {

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password must be at least 8 characters")
    private String password;
}
