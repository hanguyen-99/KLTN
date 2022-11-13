package com.document.manager.service;

import com.document.manager.domain.RoleApp;
import com.document.manager.domain.UserApp;
import com.document.manager.domain.UserReference;
import com.document.manager.dto.DashboardDTO;
import com.document.manager.dto.ResetPasswordDTO;
import com.document.manager.dto.SignUpDTO;
import com.document.manager.dto.UserInfoDTO;
import javassist.NotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface UserService {

    UserApp findUserById(Long id);

    UserApp save(UserApp userApp);

    UserApp signUp(SignUpDTO signUpDTO);

    RoleApp save(RoleApp role);

    RoleApp findRoleByName(String roleName) throws IllegalArgumentException;

    UserApp findByEmail(String email) throws IllegalArgumentException;

    void changePassword(String oldPassword, String newPassword) throws IllegalArgumentException;

    UserReference save(UserReference userReference);

    UserReference findByUuid(String uuid);

    List<UserApp> getUsers();

    UserApp updateUserInfo(Long userId, UserInfoDTO userInfoDTO) throws Exception;

    Map<String, Object> signIn(String email, String password) throws Exception;

    void updateAvatar(MultipartFile file) throws NotFoundException;

    UserApp getCurrentUser() throws NotFoundException;

    Map<String, String> refreshToken(String authorization);

    void forgotPassword(String email) throws NotFoundException;

    void resetPassword(String email, String uuid, ResetPasswordDTO resetPasswordDTO) throws NotFoundException;

    void createData();

    void resendMailForgotPassword(String email) throws NotFoundException;

    void lockAccount(Long userId) throws NotFoundException;

    void activeAccount(Long userId, String uuid) throws NotFoundException;

    DashboardDTO getDashboard();

    boolean isAdmin() throws NotFoundException;

    void unlockAccount(Long userId) throws NotFoundException;
}
