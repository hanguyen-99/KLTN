package com.document.manager.repository;

import com.document.manager.domain.RoleApp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<RoleApp, Long> {

    RoleApp findByName(String roleName);
}
