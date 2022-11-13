package com.document.manager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RoleApp implements Serializable {

    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;

    private String name;

//    @ManyToMany(mappedBy = "roleApps")
//    private Collection<UserApp> userApps = new ArrayList<>();

    public RoleApp(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
