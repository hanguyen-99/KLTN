package com.document.manager.dto.mapper;

import com.document.manager.domain.DocumentApp;
import com.document.manager.domain.UserApp;
import com.document.manager.dto.DocumentDTO;
import com.document.manager.dto.ManagerDocumentDTO;
import com.document.manager.dto.SignUpDTO;
import com.document.manager.dto.UserAppDTO;

import java.io.IOException;
import java.util.List;

public interface DTOMapper {

    UserApp toUser(SignUpDTO signUpDTO);

    UserAppDTO toUserAppDTO(UserApp userApp);

    List<UserAppDTO> toUserAppDTO(List<UserApp> userApps);

    DocumentDTO toDocumentDTO(DocumentApp documentApp) throws IOException;

    List<DocumentDTO> toDocumentDTO(List<DocumentApp> documentApps);

    ManagerDocumentDTO toManagerDocumentDTO(DocumentApp documentApp);

    List<ManagerDocumentDTO> toManagerDocumentDTO(List<DocumentApp> documentApps);

    Byte[] toBytesArray(byte[] bytes);
}
