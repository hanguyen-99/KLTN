package com.document.manager.dto.mapper.impl;

import com.document.manager.domain.DocumentApp;
import com.document.manager.domain.UserApp;
import com.document.manager.dto.DocumentDTO;
import com.document.manager.dto.ManagerDocumentDTO;
import com.document.manager.dto.SignUpDTO;
import com.document.manager.dto.UserAppDTO;
import com.document.manager.dto.constants.Constants;
import com.document.manager.dto.mapper.DTOMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.document.manager.dto.enums.Gender.FEMALE;
import static com.document.manager.dto.enums.Gender.MALE;

@Component
public class DTOMapperImpl implements DTOMapper {

    @Override
    public UserApp toUser(SignUpDTO signUpDTO) {
        UserApp userApp = new UserApp();
        if (!StringUtils.isEmpty(signUpDTO.getUserCode())) {
            userApp.setUserCode(signUpDTO.getUserCode());
        }
        if (!StringUtils.isEmpty(signUpDTO.getFirstName())) {
            userApp.setFirstName(signUpDTO.getFirstName());
        }
        if (!StringUtils.isEmpty(signUpDTO.getLastName())) {
            userApp.setLastName(signUpDTO.getLastName());
        }
        if (!StringUtils.isEmpty(signUpDTO.getGender())) {
            userApp.setGender(signUpDTO.getGender().equalsIgnoreCase("Male") ? MALE : FEMALE);
        }
        if (signUpDTO.getDob() != null) {
            userApp.setDob(signUpDTO.getDob());
        }
        if (!StringUtils.isEmpty(signUpDTO.getPhoneNumber())) {
            userApp.setPhoneNumber(signUpDTO.getPhoneNumber());
        }
        if (!StringUtils.isEmpty(signUpDTO.getEmail())) {
            userApp.setEmail(signUpDTO.getEmail());
        }
        if (!StringUtils.isEmpty(signUpDTO.getPassword())) {
            userApp.setPassword(signUpDTO.getPassword());
        }
        return userApp;
    }

    @Override
    public UserAppDTO toUserAppDTO(UserApp userApp) {
        UserAppDTO userAppDTO = new UserAppDTO();
        if (userApp.getId() != null) {
            userAppDTO.setId(userApp.getId());
        }
        if (!StringUtils.isEmpty(userApp.getUserCode())) {
            userAppDTO.setUserCode(userApp.getUserCode());
        }
        if (!StringUtils.isEmpty(userApp.getFirstName())) {
            userAppDTO.setFirstName(userApp.getFirstName());
        }
        if (!StringUtils.isEmpty(userApp.getLastName())) {
            userAppDTO.setLastName(userApp.getLastName());
        }
        if (userApp.getGender() != null) {
            userAppDTO.setGender(userApp.getGender().toString());
        }
        if (userApp.getDob() != null) {
            userAppDTO.setDob(userApp.getDob());
        }
        if (!StringUtils.isEmpty(userApp.getPhoneNumber())) {
            userAppDTO.setPhoneNumber(userApp.getPhoneNumber());
        }
        if (!StringUtils.isEmpty(userApp.getEmail())) {
            userAppDTO.setEmail(userApp.getEmail());
        }
        if (userApp.getIsActive() != null) {
            userAppDTO.setIsActive(userApp.getIsActive());
        }
        if (userApp.getCreatedStamp() != null) {
            userAppDTO.setCreatedStamp(userApp.getCreatedStamp());
        }
        if (userApp.getModifiedStamp() != null) {
            userAppDTO.setModifiedStamp(userApp.getModifiedStamp());
        }
        if (userApp.getRoleApps() != null && userApp.getRoleApps().size() > 0) {
            userAppDTO.setRoleApps(userAppDTO.getRoleApps());
        }
        if (StringUtils.isNotEmpty(userApp.getAvatar())) {
            userAppDTO.setAvatar(Constants.CLOUDINARY + userApp.getAvatar());
        }
        if (userApp.getRoleApps() != null && userApp.getRoleApps().size() > 0) {
            userAppDTO.setRoleApps(userApp.getRoleApps());
        }
        return userAppDTO;
    }

    @Override
    public DocumentDTO toDocumentDTO(DocumentApp documentApp) throws IOException {
        DocumentDTO documentDTO = new DocumentDTO();
        if (documentApp != null) {
            if (documentApp.getId() != null) {
                documentDTO.setDocumentId(documentApp.getId());
            }
            if (StringUtils.isNotEmpty(documentApp.getTitle())) {
                documentDTO.setTitle(documentApp.getTitle());
            }
            if (StringUtils.isNotEmpty(documentApp.getNote())) {
                documentDTO.setNote(documentApp.getNote());
            }
            if (documentApp.getCreatedStamp() != null) {
                documentDTO.setCreatedStamp(documentApp.getCreatedStamp());
            }
            if (!StringUtils.isEmpty(documentApp.getLink())) {
                documentDTO.setLink(documentApp.getLink());
            }
//            if (StringUtils.isNotEmpty(documentApp.getLink())) {
//                File file = new File(documentApp.getLink());
//                Path path = Paths.get(file.getAbsolutePath());
//                documentDTO.setContents(toBytesArray(Files.readAllBytes(path)));
//            }
        }
        return documentDTO;
    }

    @Override
    public List<DocumentDTO> toDocumentDTO(List<DocumentApp> documentApps) {
        List<DocumentDTO> documentDTOS = new ArrayList<>();
        if (documentApps != null && documentApps.size() > 0) {
            documentApps.forEach(d -> {
                try {
                    documentDTOS.add(this.toDocumentDTO(d));
                } catch (IOException e) {
                    // ignore exception
                }
            });
        }
        return documentDTOS;
    }

    @Override
    public ManagerDocumentDTO toManagerDocumentDTO(DocumentApp documentApp) {
        ManagerDocumentDTO managerDocument = new ManagerDocumentDTO();
        if (documentApp != null) {
            if (documentApp.getId() != null) {
                managerDocument.setDocumentId(documentApp.getId());
            }
            if (StringUtils.isNotEmpty(documentApp.getTitle())) {
                managerDocument.setTitle(documentApp.getTitle());
            }
            if (StringUtils.isNotEmpty(documentApp.getNote())) {
                managerDocument.setNote(documentApp.getNote());
            }
            if (documentApp.getCreatedStamp() != null) {
                managerDocument.setCreatedStamp(documentApp.getCreatedStamp());
            }
            if (documentApp.getUserApp() != null && StringUtils.isNotEmpty(documentApp.getUserApp().getEmail())) {
                managerDocument.setAuthor(documentApp.getUserApp().getEmail());
            }
        }
        return managerDocument;
    }

    @Override
    public List<ManagerDocumentDTO> toManagerDocumentDTO(List<DocumentApp> documentApps) {
        List<ManagerDocumentDTO> managerDocumentDTOS = new ArrayList<>();
        if (documentApps != null || documentApps.size() > 0) {
            documentApps.stream().forEach(d -> {
                try {
                    managerDocumentDTOS.add(this.toManagerDocumentDTO(d));
                } catch (Exception e) {
                    // ignore exception
                }
            });
        }
        return managerDocumentDTOS;
    }

    @Override
    public List<UserAppDTO> toUserAppDTO(List<UserApp> userApps) {
        List<UserAppDTO> userAppDTOS = new ArrayList<>();
        if (userApps != null || userApps.size() > 00) {
            for (UserApp userApp : userApps) {
                userAppDTOS.add(this.toUserAppDTO(userApp));
            }
        }
        return userAppDTOS;
    }

    @Override
    public Byte[] toBytesArray(byte[] bytesPrim) {
        if (bytesPrim == null || bytesPrim.length <= 0) {
            return new Byte[]{};
        }
        Byte[] bytes = new Byte[bytesPrim.length];
        Arrays.setAll(bytes, n -> bytesPrim[n]);
        return bytes;
    }
}
