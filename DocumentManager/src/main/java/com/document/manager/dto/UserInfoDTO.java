package com.document.manager.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO implements Serializable {

    @NotBlank(message = "Firstname is mandatory")
    private String firstName;

    @NotBlank(message = "Lastname is mandatory")
    private String lastName;

    @NotBlank(message = "Gender is mandatory")
    private String gender;

    @Size(min = 10, max = 10, message = "Phone number must be has 10 characters")
    private String phoneNumber;

    @NotBlank(message = "Code is mandatory")
    private String userCode;
    private Date dob;
}
