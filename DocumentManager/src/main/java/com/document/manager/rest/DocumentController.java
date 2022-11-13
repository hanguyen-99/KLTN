package com.document.manager.rest;

import com.document.manager.dto.DocumentDTO;
import com.document.manager.dto.ResponseData;
import com.document.manager.dto.UpdateDocumentDTO;
import com.document.manager.dto.UploadDocumentDTO;
import com.document.manager.dto.mapper.DTOMapper;
import com.document.manager.service.DocumentService;
import com.document.manager.service.SFTPService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static com.document.manager.dto.enums.ResponseDataStatus.ERROR;
import static com.document.manager.dto.enums.ResponseDataStatus.SUCCESS;

@Controller
@RequestMapping(value = "/api/document")
@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DocumentController {

    private final DocumentService documentService;

    private final DTOMapper dtoMapper;

    private final SFTPService sftpService;


    @PostMapping(value = "/upload")
    public ResponseEntity<ResponseData> uploadDocument(UploadDocumentDTO uploadDocumentDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Upload report successful")
                    .data(documentService.uploadDocument(uploadDocumentDTO))
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/documents")
    public ResponseEntity<ResponseData> getDocumentOfCurrentUser() {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Get document successful")
                    .data(documentService.getDocumentOfCurrentUser())
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<ResponseData> deleteDocument(@PathVariable(name = "id") Long id) {
        try {
            documentService.delete(id);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Delete document successful")
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<ResponseData> updateDocument(@PathVariable(name = "id") Long id, @RequestBody UpdateDocumentDTO updateDocumentDTO) {
        try {
            documentService.update(id, updateDocumentDTO);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Update document successful")
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping(value = "/manager")
    public ResponseEntity<ResponseData> getAllDocument() {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Get manager document successful")
                    .data(dtoMapper.toManagerDocumentDTO(documentService.findAll()))
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/details/{id}")
    public ResponseEntity<ResponseData> getDetailDocument(@PathVariable("id") Long id) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Get detail document successful")
                    .data(documentService.getDetailDocument(id))
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/ftp")
    public ResponseEntity<ResponseData> getFTPFile() {
        try {
            DocumentDTO documentDTO = DocumentDTO.builder()
                    .contents(dtoMapper.toBytesArray(sftpService.getFileFromSFTP("documents/Quy dinh TT_KLTN.pdf")))
                    .build();
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.name())
                    .message("Successful")
                    .data(documentDTO)
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.name()).message(e.getMessage())
                    .build(), HttpStatus.BAD_REQUEST);
        }
    }
}
