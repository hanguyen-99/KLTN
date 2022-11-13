package com.document.manager.repository;

import com.document.manager.domain.RateApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RateRepo extends JpaRepository<RateApp, Long> {

    @Query(value = "SELECT r.* FROM rate r WHERE r.type=:type", nativeQuery = true)
    RateApp findByType(String type);
}
