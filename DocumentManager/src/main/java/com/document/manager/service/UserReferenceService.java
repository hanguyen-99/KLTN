package com.document.manager.service;

import com.document.manager.domain.UserReference;
import com.document.manager.dto.enums.ReferenceType;
import javassist.NotFoundException;

import java.util.List;

public interface UserReferenceService {

    UserReference save(UserReference userReference);

    UserReference findByUserIdAndUuidAndType(Long userId, String uuid, String type);

    void deleteUserReference(UserReference userReference);

    List<UserReference> findUserReferenceByEmailAndType(String email, ReferenceType type) throws NotFoundException;

    UserReference findByUuid(String uuid);

    void deleteUserReferences(List<Long> ids);
}


