package com.document.manager.service.impl;

import com.document.manager.domain.UserApp;
import com.document.manager.domain.UserReference;
import com.document.manager.dto.enums.ReferenceType;
import com.document.manager.repository.UserReferenceRepo;
import com.document.manager.service.UserReferenceService;
import com.document.manager.service.UserService;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserReferenceImpl implements UserReferenceService {

    @Autowired
    private UserReferenceRepo userReferenceRepo;

    @Autowired
    private UserService userService;

    @Override
    public UserReference save(UserReference userReference) {
        if (userReference == null) {
            throw new IllegalArgumentException("Data invalid");
        }
        return userReferenceRepo.save(userReference);
    }

    @Override
    public UserReference findByUserIdAndUuidAndType(Long userId, String uuid, String type) {
        return userReferenceRepo.findByUserIdAndUuidAndType(userId, uuid, type);
    }

    @Override
    public void deleteUserReference(UserReference userReference) {
        if (userReference == null || userReference.getId() == null) {
            log.error("Can't delete user reference");
            throw new IllegalArgumentException("Data invalid");
        }
        userReferenceRepo.delete(userReference);
    }

    @Override
    public List<UserReference> findUserReferenceByEmailAndType(String email, ReferenceType type) throws NotFoundException {
        if (StringUtils.isEmpty(email)) {
            throw new IllegalArgumentException("Email can't empty");
        }
        if (type == null) {
            throw new IllegalArgumentException("Reference type can't null");
        }
        UserApp userApp = userService.findByEmail(email);
        if (userApp == null) {
            throw new NotFoundException("User not found");
        }
        return userReferenceRepo.findUserReferenceByUserIdAndType(userApp.getId(), type.name());
    }

    @Override
    public UserReference findByUuid(String uuid) {
        if (StringUtils.isEmpty(uuid)) {
            throw new IllegalArgumentException("Uuid can't empty");
        }
        return userReferenceRepo.findByUuid(uuid);
    }

    @Override
    public void deleteUserReferences(List<Long> ids) {
        if(ids == null ) {
            throw new IllegalArgumentException("Data invalid");
        }
        userReferenceRepo.delete(ids);
    }
}
