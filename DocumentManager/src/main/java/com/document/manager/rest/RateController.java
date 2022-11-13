package com.document.manager.rest;

import com.document.manager.domain.RateApp;
import com.document.manager.dto.RateAppDTO;
import com.document.manager.dto.ResponseData;
import com.document.manager.service.RateService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.document.manager.dto.enums.ResponseDataStatus.ERROR;
import static com.document.manager.dto.enums.ResponseDataStatus.SUCCESS;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(value = "/api/rate")
@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class RateController {

    @Autowired
    private RateService rateService;

    @GetMapping(value = "/rates")
    public ResponseEntity<ResponseData> getRateApps() {
        return new ResponseEntity<>(ResponseData.builder()
                .status(SUCCESS.toString())
                .data(rateService.findAll())
                .message("Get list rate app successful").build(), OK);
    }

    @GetMapping
    public ResponseEntity<ResponseData> getRateAppByType(@RequestParam(name = "type") String type) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .data(rateService.findByType(type))
                    .message("Get rate app by type successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.toString())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PostMapping
    public ResponseEntity<ResponseData> createRate(@RequestBody RateAppDTO rateAppDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .data(rateService.save(rateAppDTO))
                    .message("Create rate app by type successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.toString())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @PutMapping
    public ResponseEntity<ResponseData> update(@RequestBody RateAppDTO rateAppDTO) {
        try {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .data(rateService.update(rateAppDTO))
                    .message("Create rate app by type successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.toString())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<ResponseData> delete(@PathVariable(name = "id") Long id) {
        try {
            rateService.delete(id);
            return new ResponseEntity<>(ResponseData.builder()
                    .status(SUCCESS.toString())
                    .message("Delete successful").build(), OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(ERROR.toString())
                    .message(e.getMessage()).build(), BAD_REQUEST);
        }
    }
}
