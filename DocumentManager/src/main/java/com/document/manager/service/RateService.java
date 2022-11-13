package com.document.manager.service;

import com.document.manager.domain.RateApp;
import com.document.manager.dto.RateAppDTO;
import javassist.NotFoundException;

import java.util.List;

public interface RateService {

    RateApp save(RateAppDTO rateAppDTO);

    List<RateApp> findAll();

    RateApp findByType(String type);

    RateApp update(RateAppDTO rateAppDTO);

    void delete(Long id) throws NotFoundException;
}
