package com.document.manager.service.impl;

import com.document.manager.domain.Sentences;
import com.document.manager.repository.SentencesRepo;
import com.document.manager.service.SentencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SentencesServiceImpl implements SentencesService {

    @Autowired
    private SentencesRepo sentencesRepo;

    @Override
    public List<Sentences> findAll() {
        return sentencesRepo.findAll();
    }
}
