package com.document.manager.dto;

import com.document.manager.domain.RoleApp;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class UserAppDTO {

    private Long id;
    private String userCode;
    private String email;
    private String firstName;
    private String lastName;
    private String gender;
    private String phoneNumber;
    private Date dob;
    private String avatar;
    private Boolean isActive;
    private Date createdStamp;
    private Date modifiedStamp;
    private List<RoleApp> roleApps;
}
