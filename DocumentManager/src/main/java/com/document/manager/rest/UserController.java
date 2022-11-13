package com.document.manager.rest;


import com.document.manager.domain.UserApp;
import com.document.manager.dto.*;
import com.document.manager.dto.mapper.DTOMapper;
import com.document.manager.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.PermitAll;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static com.document.manager.dto.enums.ResponseDataStatus.ERROR;
import static com.document.manager.dto.enums.ResponseDataStatus.SUCCESS;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(value = "/api/user")
@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Api(value = "/api/user", tags = "User Controller")
public class UserController {

    private final DTOMapper dtoMapper;

    private final UserService userService;

    @GetMapping("/welcome")
    @ApiOperation(value = "API test connection")
    public ResponseEntity<ResponseData> welcome() {
        return new ResponseEntity<>(ResponseData.builder()
                .status(SUCCESS.toString())
                .message("Welcome to my app")
                .data("Connect success").build(), OK);
    }

    @GetMapping("/data")
    @ApiOperation(value = "API create data default")
    public ResponseEntity<ResponseData> createData() {
        userService.createData();
        return new ResponseEntity<>(ResponseData.builder()
                .status(SUCCESS.toString())
                .message("Create data successful").build(), OK);
    }

    @PostMapping(value = "/sign-in")
    @ApiOperation(value = "API sign in")
    public ResponseEntity<ResponseData> signIn(@Validated @RequestBody SignInDTO signInDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .message("Sign in successful")
                    .data(userService.signIn(signInDTO.getEmail(), signInDTO.getPassword())).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.toString())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PostMapping(value = "/sign-up")
    @ApiOperation(value = "API sign up")
    public ResponseEntity<ResponseData> signUp(@Validated @RequestBody SignUpDTO signUpDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .message("Sign up successful")
                    .data(userService.signUp(signUpDTO)).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/change-password")
    @ApiOperation(value = "API change password")
    public ResponseEntity<ResponseData> changePassword(@Validated @RequestBody ChangePasswordDTO changePasswordDTO) {
        try {
            userService.changePassword(changePasswordDTO.getOldPassword(), changePasswordDTO.getNewPassword());
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Change password successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PermitAll
    @PostMapping(value = "/forgot-password")
    @ApiOperation(value = "API send request forgot password")
    public ResponseEntity<ResponseData> forgotPassword(@RequestParam("email") String email) {
        try {
            userService.forgotPassword(email);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Send request forgot password success").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/reset-password")
    @ApiOperation(value = "API reset password")
    public ResponseEntity<ResponseData> resetPassword(@RequestParam("email") String email,
                                                      @RequestParam("uuid") String uuid,
                                                      @Validated @RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            userService.resetPassword(email, uuid, resetPasswordDTO);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Reset password successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @GetMapping(value = "/resend")
    @ApiOperation(value = "API resend email when request forgot password")
    public ResponseEntity<ResponseData> resendMailForgotPassword(@RequestParam("email") String email) {
        try {
            userService.resendMailForgotPassword(email);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Resend mail forgot password successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    @ApiOperation(value = "API get all users in system      (Role: Admin)")
    public ResponseEntity<ResponseData> getUsers() {
        return new ResponseEntity<>(ResponseData.builder()
                .status(SUCCESS.name())
                .message("Get all users success")
                .data(dtoMapper.toUserAppDTO(userService.getUsers())).build(), OK);
    }

    @PatchMapping(value = "/{id}")
    @ApiOperation(value = "API update user information")
    public ResponseEntity<ResponseData> updateUserInfo(@PathVariable("id") Long userId, @Validated @RequestBody UserInfoDTO userInfoDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Update user information successful")
                    .data(dtoMapper.toUserAppDTO(userService.updateUserInfo(userId, userInfoDTO))).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping(value = "/lock/{id}")
    @ApiOperation(value = "API lock account (set is_active = false)         (Role: Admin)")
    public ResponseEntity<ResponseData> lockAccount(@PathVariable("id") Long userId) {
        try {
            userService.lockAccount(userId);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Locked account success").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @GetMapping(value = "/active")
    @ApiOperation(value = "API active account (set is_active = true)")
    public ResponseEntity<ResponseData> activeAccount(@RequestParam("id") String userId, @RequestParam("uuid") String uuid) {
        try {
            userService.activeAccount(Long.parseLong(userId), uuid);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Active account successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @GetMapping(value = "/info")
    @ApiOperation(value = "API get information of user current")
    public ResponseEntity<ResponseData> getUserInfoCurrent() {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Get user info current success")
                    .data(dtoMapper.toUserAppDTO(userService.getCurrentUser())).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PostMapping(value = "/avatar")
    @ApiOperation(value = "API change avatar of user")
    public ResponseEntity<ResponseData> updateAvatar(@RequestParam(value = "file") MultipartFile file) {
        try {
            userService.updateAvatar(file);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Update avatar successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PostMapping(value = "/token/refresh")
    @ApiOperation(value = "API to get access token from refresh token")
    public ResponseEntity<ResponseData> refreshToken(@Validated @RequestBody AuthorizationDTO authorizationDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder().status(SUCCESS.name())
                    .message("Refresh token successful").data(userService
                            .refreshToken(authorizationDTO.getAuthorization())).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder().status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @GetMapping(value = "/logout")
    @ApiOperation(value = "API to log out")
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping(value = "/dashboard")
    @ApiOperation(value = "API to get summary for dashboard         (Role: Admin)")
    public ResponseEntity<ResponseData> getSummaryOfDashboard() {
        try {
            return new ResponseEntity<>(ResponseData.builder().status(SUCCESS.name())
                    .message("Get summary for dashboard successful")
                    .data(userService.getDashboard()).build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder().status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping(value = "/unlock/{id}")
    @ApiOperation(value = "API unlock account (set is_active = true)         (Role: Admin)")
    public ResponseEntity<ResponseData> unlockAccount(@PathVariable("id") Long userId) {
        try {
            userService.unlockAccount(userId);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Unlock account successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @GetMapping(value = "/images")
    public ResponseEntity<byte[]> getImagesFormServer() throws NotFoundException, IOException {
        UserApp userApp = userService.getCurrentUser();
        Path path = Paths.get(System.getProperty("user.home") + File.separator + "images" + File.separator + userApp.getAvatar());
        return new ResponseEntity<>(Files.readAllBytes(path), OK);
    }
}
