package com.document.manager.exception;

import com.document.manager.dto.ResponseData;
import com.document.manager.dto.enums.ResponseDataStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class HandleException {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ResponseEntity<ResponseData> handleValidationExceptions(MethodArgumentNotValidException e) {
        log.warn("Returning HTTP 400 Bad Request", e);
        Map<Object, Object> errorMessages = new HashMap<>();

        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errorMessages.put(fieldName, errorMessage);
        });

        ResponseData responseData = ResponseData.builder()
                .status(ResponseDataStatus.ERROR.name())
                .message("Data invalid")
                .data(errorMessages).build();

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
}
