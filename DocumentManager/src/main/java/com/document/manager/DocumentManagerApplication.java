package com.document.manager;

import com.document.manager.domain.RoleApp;
import com.document.manager.domain.UserApp;
import com.document.manager.dto.enums.Gender;
import com.document.manager.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class DocumentManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DocumentManagerApplication.class, args);
    }

//    @Bean
//    CommandLineRunner run(UserService userService) throws Exception {
//        return args -> {
//            RoleApp roleAdmin = new RoleApp(null, "ROLE_ADMIN");
//            RoleApp roleUser = new RoleApp(null, "ROLE_USER");
//
//            if (userService.findRoleByName("ROLE_USER") == null) {
//                userService.save(roleUser);
//            }
//            if (userService.findRoleByName("ROLE_ADMIN") == null) {
//                userService.save(roleAdmin);
//            }
//            if (userService.findByEmail("admin@yopmail.com") == null) {
//                List<RoleApp> roles = new ArrayList<>();
//                roles.add(roleAdmin);
//                roles.add(roleUser);
//
//                userService.save(new UserApp(null,
//                        "10000000",
//                        "A",
//                        "Admin",
//                        Gender.MALE,
//                        new Date("01/01/1999"),
//                        "1111111111",
//                        "admin@yopmail.com",
//                        "12345678",
//                        true,
//                        new Date(),
//                        null,
//                        roles));
//            }
//            if (userService.findByEmail("user@yopmail.com") == null) {
//                List<RoleApp> roles = new ArrayList<>();
//                roles.add(roleUser);
//
//                userService.save(new UserApp(null,
//                        "10000001",
//                        "U",
//                        "User",
//                        Gender.MALE,
//                        new Date("02/02/2000"),
//                        "2222222222",
//                        "user@yopmail.com",
//                        "12345678",
//                        true,
//                        new Date(),
//                        null,
//                        roles));
//            }
//        };
//    }
}
