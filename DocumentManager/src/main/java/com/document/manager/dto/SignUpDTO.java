package com.document.manager.dto;

import lombok.*;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpDTO implements Serializable {

    @NotBlank(message = "Code is mandatory")
    private String userCode;

    @NotBlank(message = "Firstname is mandatory")
    private String firstName;

    @NotBlank(message = "Lastname is mandatory")
    private String lastName;

    @NotBlank(message = "Gender is mandatory")
    private String gender;

    private Date dob;

    @Size(min = 10, max = 10, message = "Phone number must be has 10 characters")
    private String phoneNumber;

    @NotBlank
    @Email(message = "Email invalid")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
