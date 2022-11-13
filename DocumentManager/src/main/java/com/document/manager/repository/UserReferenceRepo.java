package com.document.manager.repository;

import com.document.manager.domain.UserReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserReferenceRepo extends JpaRepository<UserReference, Long> {

    UserReference findByUuid(String uuid);

    @Query(value = "SELECT u.* FROM user_reference u WHERE u.user_id =:userId AND u.uuid=:uuid AND u.type=:type", nativeQuery = true)
    UserReference findByUserIdAndUuidAndType(Long userId, String uuid, String type);

    @Query(value = "SELECT u.* FROM user_reference u WHERE u.user_id =:userId AND u.type=:type", nativeQuery = true)
    List<UserReference> findUserReferenceByUserIdAndType(Long userId, String type);

    @Query(value = "DELETE FROM user_reference u WHERE u.id in (:ids)", nativeQuery = true)
    @Modifying
    void delete(List<Long> ids);
}
