package com.document.manager.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.document.manager.domain.RoleApp;
import com.document.manager.domain.UserApp;
import com.document.manager.domain.UserReference;
import com.document.manager.dto.DashboardDTO;
import com.document.manager.dto.ResetPasswordDTO;
import com.document.manager.dto.SignUpDTO;
import com.document.manager.dto.UserInfoDTO;
import com.document.manager.dto.constants.Constants;
import com.document.manager.dto.enums.Gender;
import com.document.manager.dto.enums.ReferenceType;
import com.document.manager.dto.mapper.DTOMapper;
import com.document.manager.repository.RoleRepo;
import com.document.manager.repository.UserRepo;
import com.document.manager.service.*;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import static com.document.manager.dto.enums.Gender.FEMALE;
import static com.document.manager.dto.enums.Gender.MALE;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileService fileService;

    @Autowired
    private Environment environment;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private MailService mailService;

    @Autowired
    private DTOMapper dtoMapper;

    @Autowired
    private UserReferenceService userReferenceService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private CloudinaryService cloudinaryService;


    @Override
    public UserDetails loadUserByUsername(String username) {
        UserApp userApp = userRepo.findByEmail(username);
        if (userApp == null) {
            log.error("User {} not found", username);
            return null;
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        userApp.getRoleApps().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
        return new org.springframework.security.core.userdetails.User(userApp.getEmail(), userApp.getPassword(), authorities);
    }

    @Override
    public UserApp findUserById(Long id) {
        Optional<UserApp> userOptional = userRepo.findById(id);
        if (userOptional.isPresent()) {
            log.info("User with id {} found", id);
            return userOptional.get();
        }
        log.error("User with id {} not fount", id);
        return null;
    }

    @Override
    public UserApp save(UserApp userApp) {
        log.info("Saving user {} to the database", userApp.getEmail());
        return userRepo.save(userApp);
    }

    @Transactional
    @Override
    public UserApp signUp(SignUpDTO signUpDTO) {
        try {
            if (this.findByEmail(signUpDTO.getEmail()) != null) {
                log.error("Email {} already exist in database", signUpDTO.getEmail());
                throw new IllegalArgumentException("Email already exist");
            }
            UserApp userApp = dtoMapper.toUser(signUpDTO);

            if (userApp.getRoleApps() == null || userApp.getRoleApps().size() <= 0) {
                RoleApp roleUser = roleRepo.findByName(Constants.ROLE_USER);
                if (roleUser != null) {
                    userApp.setRoleApps(new ArrayList<>(Collections.singleton(roleUser)));
                }
            }
            userApp.setPassword(passwordEncoder.encode(userApp.getPassword()));
            userApp.setIsActive(Boolean.FALSE);
            userApp = this.save(userApp);
            // Send mail
            Map<String, Object> mapData = new HashMap<>();
            String uuid = UUID.randomUUID().toString();
            mapData.put("link", environment.getProperty("server.fe") + "/confirm-account?id=" + userApp.getId() + "&uuid=" + uuid);
            LocalDateTime now = LocalDateTime.now();
            Date createdStamp = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
            UserReference userReference = UserReference.builder().userApp(userApp).uuid(uuid)
                    .createdStamp(createdStamp).type(ReferenceType.REGISTER).build();
            userReferenceService.save(userReference);
            mailService.sendMailRegister(userApp.getEmail(), userApp.getFirstName() + userApp.getLastName(), mapData);
            log.info("Sign up successful with email {}", userApp.getEmail());
            return userApp;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public RoleApp save(RoleApp role) {
        log.info("Saving new role {} to the database", role.getName());
        return roleRepo.save(role);
    }

    @Override
    public RoleApp findRoleByName(String roleName) throws IllegalArgumentException {
        if (StringUtils.isEmpty(roleName)) {
            log.error("Role name is empty");
            throw new IllegalArgumentException("Role name not allowed empty");
        }
        RoleApp role = roleRepo.findByName(roleName);
        if (role == null) {
            log.error("Role {} not found", roleName);
            return null;
        }
        log.info("Role {} found", roleRepo);
        return role;
    }

    @Override
    public UserApp findByEmail(String email) throws IllegalArgumentException {
        if (StringUtils.isEmpty(email)) {
            log.error("Email is empty");
            throw new IllegalArgumentException("Emails are not allowed to be empty");
        }
        UserApp userApp = userRepo.findByEmail(email);
        if (userApp == null) {
            log.error("User with email {} not found", email);
            return null;
        }
        log.info("User with email {} found", email);
        return userApp;
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) throws IllegalArgumentException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            log.error("Can't get info of user current!");
            throw new IllegalArgumentException("Can't get info of user current!");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        if (StringUtils.isEmpty(email)) {
            log.error("Emails of user current is empty");
            throw new IllegalArgumentException("Can't get email of user current!");
        }
        UserApp userApp = findByEmail(email);
        if (!passwordEncoder.matches(oldPassword, userApp.getPassword())) {
            log.error("Old password is incorrect");
            throw new IllegalArgumentException("Old password is incorrect");
        }
        userApp.setPassword(passwordEncoder.encode(newPassword));
        log.info("Change password for user {} success", userApp.getEmail());
        save(userApp);
    }

    @Override
    public UserReference save(UserReference userReference) {
        log.info("Saving new user reference with uuid {} for user {} to the database",
                userReference.getUuid(), userReference.getUserApp().getEmail());
        return userReferenceService.save(userReference);
    }

    @Override
    public UserReference findByUuid(String uuid) {
        if (StringUtils.isEmpty(uuid)) {
            log.error("Uuid is empty");
            return null;
        }
        UserReference userReference = userReferenceService.findByUuid(uuid);
        if (userReference == null) {
            log.error("User reference with uuid {} not found", uuid);
            return null;
        }
        log.info("User reference with uuid {} found", uuid);
        return userReference;
    }

    @Override
    public List<UserApp> getUsers() {
        log.info("Get all users");
        return userRepo.findUsers();
    }

    @Override
    public UserApp updateUserInfo(Long userId, UserInfoDTO userInfoDTO) throws Exception {
        UserApp userApp = this.findUserById(userId);
        if (userApp == null) {
            log.error("User with id {} not found", userId);
            throw new NotFoundException("User with id " + userId + " not found");
        }
        if (userInfoDTO == null) {
            return userApp;
        }
        if (!StringUtils.isEmpty(userInfoDTO.getUserCode())) {
            userApp.setUserCode(userInfoDTO.getUserCode());
        }
        if (!StringUtils.isEmpty(userInfoDTO.getFirstName())) {
            userApp.setFirstName(userInfoDTO.getFirstName());
        }
        if (!StringUtils.isEmpty(userInfoDTO.getLastName())) {
            userApp.setLastName(userInfoDTO.getLastName());
        }
        if (!StringUtils.isEmpty(userInfoDTO.getGender())) {
            userApp.setGender(userInfoDTO.getGender().equalsIgnoreCase(MALE.toString()) ? MALE : FEMALE);
        }
        if (!StringUtils.isEmpty(userInfoDTO.getPhoneNumber())) {
            userApp.setPhoneNumber(userInfoDTO.getPhoneNumber());
        }
        if (userInfoDTO.getDob() != null) {
            userApp.setDob(userInfoDTO.getDob());
        }
        log.error("Update user info success");
        return save(userApp);
    }

    @Override
    public Map<String, Object> signIn(String email, String password) {
        UserApp userApp = this.findByEmail(email);
        if (userApp == null) {
            throw new IllegalArgumentException("Account does not exist in the system!");
        }
        if (!userApp.getIsActive()) {
            if (userApp.getModifiedStamp() != null) {
                throw new IllegalArgumentException("Account is locked!");
            }
            throw new IllegalArgumentException("Account not activated");
        }
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            User user = (User) authentication.getPrincipal();
            Algorithm algorithm = Algorithm.HMAC256(environment.getProperty("jwt.secret").getBytes());
            String access_token = JWT.create()
                    .withSubject(email)
                    .withIssuer(request.getRequestURL().toString())
                    .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(environment.getProperty("jwt.access.token.expire"))))
                    .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                    .sign(algorithm);
            String refresh_token = JWT.create()
                    .withSubject(email)
                    .withIssuer(request.getRequestURL().toString())
                    .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(environment.getProperty("jwt.refresh.token.expire"))))
                    .sign(algorithm);
            log.info("User {} login success", email);
            Map<String, Object> mapData = new HashMap<>();
            mapData.put("access_token", access_token);
            mapData.put("refresh_token", refresh_token);
            mapData.put("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            return mapData;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new IllegalArgumentException("Email or password incorrect!");
        }
    }

    @Override
    @Transactional
    public void updateAvatar(MultipartFile file) throws NotFoundException {
        if (file == null) {
            throw new NotFoundException("Avatar not found");
        }
        try {
            UserApp userApp = getCurrentUser();
            String oldAvatar = userApp.getAvatar();
            if (StringUtils.isNotEmpty(oldAvatar) && oldAvatar.contains(".")) {
                String oldPublicId = oldAvatar.substring(0, oldAvatar.indexOf("."));
                cloudinaryService.delete(oldPublicId, Constants.CLOUD_IMAGE);
            }
            File file1 = new File(Constants.DIR_SERVER + file.getOriginalFilename());
            FileUtils.writeByteArrayToFile(file1, file.getBytes());
            userApp.setAvatar(cloudinaryService.upload(file, Constants.CLOUD_IMAGE));
            this.save(userApp);
        } catch (NotFoundException | IOException e) {
            throw new NotFoundException(e.getMessage());
        }
    }

    @Override
    public UserApp getCurrentUser() throws NotFoundException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            log.error("Can't get info of user current!");
            throw new IllegalArgumentException("Can't get info of user current!");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        UserApp userApp = this.findByEmail(email);
        if (userApp == null) {
            log.error("User with email {} not found", email);
            throw new NotFoundException("Current user not found");
        }
        return userApp;
    }

    @Override
    public Map<String, String> refreshToken(String authorization) {
        if (StringUtils.isEmpty(authorization) || !authorization.startsWith("Bearer ")) {
            log.error("Refresh token is missing");
            throw new IllegalArgumentException("Refresh token is missing");
        }
        try {
            String refresh_token = authorization.substring("Bearer " .length());
            Algorithm algorithm = Algorithm.HMAC256(environment.getProperty("jwt.secret").getBytes());
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT decodedJWT = verifier.verify(refresh_token);
            String email = decodedJWT.getSubject();
            UserApp user = this.findByEmail(email);
            String access_token = JWT.create()
                    .withSubject(user.getEmail())
                    .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(environment.getProperty("jwt.access.token.expire"))))
                    .withIssuer(request.getRequestURL().toString())
                    .withClaim("roles", user.getRoleApps().stream().map(RoleApp::getName).collect(Collectors.toList()))
                    .sign(algorithm);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", access_token);
            return tokens;
        } catch (Exception e) {
            log.error("Refresh token with error: " + e.getMessage());
            log.info("Refresh token error is: {}", authorization.substring("Bearer " .length()));
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void forgotPassword(String email) throws NotFoundException {
        if (StringUtils.isEmpty(email)) {
            log.error("Email is empty");
            throw new IllegalArgumentException("Email is not allow empty");
        }
        UserApp userApp = this.findByEmail(email);
        if (userApp == null) {
            log.error("User {} not found", email);
            throw new NotFoundException("User not found");
        }
        String uuid = UUID.randomUUID().toString();

        LocalDateTime now = LocalDateTime.now();
        Date createdStamp = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        Date expiredStamp = Date.from(now.plusMinutes(Long.parseLong(environment.getProperty("server.time.expired.forgot-password")))
                .atZone(ZoneId.systemDefault()).toInstant());
        UserReference userReference = UserReference.builder().userApp(userApp).uuid(uuid)
                .createdStamp(createdStamp).expiredStamp(expiredStamp).type(ReferenceType.RESET_PASSWORD).build();
        userReference = this.save(userReference);
        if (userReference != null) {
            // Send mail
            Map<String, Object> mapData = new HashMap<>();
            String link = environment.getProperty("server.fe") + "/reset-password?email=" + userReference.getUserApp().getEmail() + "&uuid=" + uuid;
            mapData.put("link", link);
            mailService.sendMailForgotPassword(userApp.getEmail(), userApp.getFirstName() + userApp.getLastName(), mapData);
        }
    }

    @Override
    public void resetPassword(String email, String uuid, ResetPasswordDTO resetPasswordDTO) throws NotFoundException {
        if (StringUtils.isEmpty(email)) {
            log.error("Email is empty");
            throw new IllegalArgumentException("Email not allow empty");
        }
        if (StringUtils.isEmpty(uuid)) {
            log.error("Code is empty");
            throw new IllegalArgumentException("Code not allow empty");
        }
        UserApp userApp = this.findByEmail(email);
        if (userApp == null) {
            log.error("User {} not found", email);
            throw new NotFoundException("User not found");
        }
        // Handle reset password
        UserReference userReference = this.findByUuid(uuid);
        if (userReference == null) {
            log.error("User reference with uuid {} not found", uuid);
            throw new NotFoundException("User reference not found");
        }
        if (new Date().after(userReference.getExpiredStamp())) {
            log.error("User reference with uuid {} was expired", uuid);
            throw new RuntimeException("User reference was expired");
        }
        userApp.setPassword(passwordEncoder.encode(resetPasswordDTO.getPassword()));
        this.save(userApp);
        log.info("Reset password successful");
    }

    @Override
    public void createData() {
        log.info("Root dir of user: " + System.getProperty("user.dir"));
        if (this.findRoleByName(Constants.ROLE_USER) == null) {
            RoleApp roleUser = new RoleApp(null, Constants.ROLE_USER);
            this.save(roleUser);
        }
        if (this.findRoleByName(Constants.ROLE_ADMIN) == null) {
            RoleApp roleAdmin = new RoleApp(null, Constants.ROLE_ADMIN);
            this.save(roleAdmin);
        }

        RoleApp roleAdmin = this.findRoleByName(Constants.ROLE_ADMIN);
        RoleApp roleUser = this.findRoleByName(Constants.ROLE_USER);
        if (this.findByEmail("admin@yopmail.com") == null) {
            List<RoleApp> roles = new ArrayList<>();
            roles.add(roleAdmin);
            roles.add(roleUser);

            this.save(new UserApp("10000000",
                    "A",
                    "Admin",
                    Gender.MALE,
                    new Date("01/01/1999"),
                    "1111111111",
                    "admin@yopmail.com",
                    passwordEncoder.encode("12345678"),
                    roles));
        }
        if (this.findByEmail("user@yopmail.com") == null) {
            this.save(new UserApp("10000001",
                    "U",
                    "User",
                    Gender.MALE,
                    new Date("02/02/2000"),
                    "2222222222",
                    "user@yopmail.com",
                    passwordEncoder.encode("12345678"),
                    new ArrayList<>(Collections.singleton(roleUser))));
        }
    }

    @Transactional
    @Override
    public void resendMailForgotPassword(String email) throws NotFoundException {
        if (StringUtils.isEmpty(email)) {
            log.info("Email is empty");
            throw new IllegalArgumentException("Email not allow empty");
        }
        UserApp userApp = this.findByEmail(email);
        if (userApp == null) {
            log.info("User {} not found", email);
            throw new NotFoundException("User not found");
        }
        List<UserReference> userReferences = this.userReferenceService.findUserReferenceByEmailAndType(email, ReferenceType.RESET_PASSWORD);
        if (userReferences != null && userReferences.size() > 0) {
            userReferenceService.deleteUserReferences(userReferences.stream().map(UserReference::getId).collect(Collectors.toList()));
        }
        String uuid = UUID.randomUUID().toString();

        LocalDateTime now = LocalDateTime.now();
        Date createdStamp = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        Date expiredStamp = Date.from(now.plusMinutes(Long.parseLong(environment.getProperty("server.time.expired.forgot-password")))
                .atZone(ZoneId.systemDefault()).toInstant());
        UserReference userReference = UserReference.builder().userApp(userApp).uuid(uuid)
                .createdStamp(createdStamp).expiredStamp(expiredStamp).type(ReferenceType.RESET_PASSWORD).build();
        userReference = this.save(userReference);

        if (userReference != null) {
            // Send mail
            Map<String, Object> mapData = new HashMap<>();
            String link = environment.getProperty("server.fe") + "/reset-password?email=" + userReference.getUserApp().getEmail() + "&uuid=" + uuid;
            mapData.put("link", link);
            mailService.sendMailForgotPassword(userApp.getEmail(), userApp.getFirstName() + userApp.getLastName(), mapData);
            log.info("Resend mail reset password to email {}", userApp.getEmail());
        }
    }

    @Override
    public void lockAccount(Long userId) throws NotFoundException {
        if (userId == null) {
            throw new IllegalArgumentException("User id can't null");
        }
        UserApp userApp = this.findUserById(userId);
        if (userApp == null) {
            log.error("User with id {} not found", userId);
            throw new NotFoundException("User with id " + userId + " not found");
        }
        userApp.setIsActive(Boolean.FALSE);
        this.save(userApp);
    }

    @Transactional
    @Override
    public void activeAccount(Long userId, String uuid) throws NotFoundException {
        if (userId == null || StringUtils.isEmpty(uuid)) {
            log.info("Active account with id {} and uuid {}", userId, uuid);
            throw new IllegalArgumentException("Params data invalid");
        }
        UserApp userApp = this.findUserById(userId);
        if (userApp == null) {
            log.error("User with id {} not found", userId);
            throw new NotFoundException("User not found");
        }
        if (userApp.getIsActive()) {
            throw new RuntimeException("This account is now activated");
        }
        UserReference userReference = userReferenceService.findByUserIdAndUuidAndType(userId, uuid, ReferenceType.REGISTER.name());
        if (userReference == null) {
            log.error("Can't found info active user with id {} and uuid {}", userId, uuid);
            throw new NotFoundException("Can't found info active user");
        }
        userApp.setIsActive(Boolean.TRUE);
        this.save(userApp);
        userReferenceService.deleteUserReference(userReference);
        log.info("Active user with id {} successful", userId);
    }

    @Override
    public DashboardDTO getDashboard() {
        return DashboardDTO.builder()
                .countUserActive(userRepo.countUserByIsActive(Boolean.TRUE))
                .countUserNotActive(userRepo.countUserByIsActive(Boolean.FALSE))
                .countDocument(documentService.count())
                .build();
    }

    @Override
    public boolean isAdmin() throws NotFoundException {
        UserApp userApp = this.getCurrentUser();
        if (userApp != null && userApp.getRoleApps() != null) {
            for (RoleApp roleApp : userApp.getRoleApps()) {
                if (roleApp.getName().equalsIgnoreCase(Constants.ROLE_ADMIN)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public void unlockAccount(Long userId) throws NotFoundException {
        if (userId == null) {
            throw new IllegalArgumentException("User id can't null");
        }
        UserApp userApp = this.findUserById(userId);
        if (userApp == null) {
            log.error("User with id {} not found", userId);
            throw new NotFoundException("User with id " + userId + " not found");
        }
        userApp.setIsActive(Boolean.TRUE);
        this.save(userApp);
        List<UserReference> userReferences = userReferenceService.findUserReferenceByEmailAndType(userApp.getEmail(), ReferenceType.REGISTER);
        if (!CollectionUtils.isEmpty(userReferences)) {
            userReferenceService.deleteUserReferences(userReferences.stream().map(u -> u.getId()).collect(Collectors.toList()));
        }
    }
}