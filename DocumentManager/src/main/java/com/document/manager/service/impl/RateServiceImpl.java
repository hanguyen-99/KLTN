package com.document.manager.service.impl;

import com.document.manager.domain.RateApp;
import com.document.manager.dto.RateAppDTO;
import com.document.manager.dto.enums.RateType;
import com.document.manager.repository.RateRepo;
import com.document.manager.service.RateService;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RateServiceImpl implements RateService {

    @Autowired
    private RateRepo rateRepo;

    @Override
    public RateApp save(RateAppDTO rateAppDTO) {
        if (rateAppDTO == null) {
            throw new IllegalArgumentException("Rate can't null");
        }
        if (this.findByType(rateAppDTO.getType()) != null) {
            log.info("RateApp with type {} have already exist", rateAppDTO.getType());
            throw new IllegalArgumentException("RateApp with type " + rateAppDTO.getType() + "have already exist");
        }
        RateApp rateApp = RateApp.builder().rate(rateAppDTO.getRate()).type(RateType.valueOf(rateAppDTO.getType())).build();
        log.info("Save rate app successful");
        return rateRepo.save(rateApp);
    }

    @Override
    public List<RateApp> findAll() {
        return rateRepo.findAll();
    }

    @Override
    public RateApp findByType(String type) {
        if (StringUtils.isEmpty(type)) {
            throw new IllegalArgumentException("Type of rate app can't null");
        }
        if (RateType.valueOf(type) == null) {
            throw new IllegalArgumentException("Type of rate app invalid");
        }
        return rateRepo.findByType(type);
    }

    @Override
    public RateApp update(RateAppDTO rateAppDTO) {
        if (rateAppDTO == null) {
            throw new IllegalArgumentException("Rate can't null");
        }
        RateApp rootRate = this.findByType(rateAppDTO.getType());
        if (rootRate == null) {
            log.info("Can't found rootRate app with type {}", rateAppDTO.getType());
            throw new IllegalArgumentException("Can't found rootRate app with type " + rateAppDTO.getType());
        }
        rootRate.setRate(rateAppDTO.getRate());
        return rateRepo.save(rootRate);
    }

    @Override
    public void delete(Long id) throws NotFoundException {
        if (id == null) {
            throw new IllegalArgumentException("Id rate can't null");
        }
        Optional<RateApp> rateAppOptional = rateRepo.findById(id);
        if (!rateAppOptional.isPresent()) {
            log.info("Rate app with id {} not found", id);
            throw new NotFoundException("Rate app with id " + id + " not found");
        }
        rateRepo.delete(rateAppOptional.get());
    }
}
