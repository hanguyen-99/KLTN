package com.document.manager.domain;

import com.document.manager.dto.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_app")
@Data
@AllArgsConstructor
public class UserApp implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_code")
    private String userCode;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.ORDINAL)
    private Gender gender;

    private Date dob;

    private String avatar;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String email;
    private String password;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_stamp")
    private Date createdStamp;

    @Column(name = "modified_stamp")
    private Date modifiedStamp;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private List<RoleApp> roleApps = new ArrayList<>();

    public UserApp() {
        isActive = true;
        createdStamp = new Timestamp(System.currentTimeMillis());
    }

    public UserApp(String userCode, String firstName, String lastname, Gender gender, Date dob, String phoneNumber, String email, String password, List<RoleApp> roleApps) {
        this.userCode = userCode;
        this.firstName = firstName;
        this.lastName = lastname;
        this.gender = gender;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.isActive = true;
        this.createdStamp = new Timestamp(System.currentTimeMillis());
        this.roleApps = roleApps;
    }
}
