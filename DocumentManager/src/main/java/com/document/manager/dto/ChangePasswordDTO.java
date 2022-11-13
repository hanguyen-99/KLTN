package com.document.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDTO {

    @NotBlank(message = "Old password is mandatory")
    @Size(min = 8, message = "Old Password must be at least 8 characters")
    private String oldPassword;

    @NotBlank(message = "New password is mandatory")
    @Size(min = 8, message = "New Password must be at least 8 characters")
    private String newPassword;
}
