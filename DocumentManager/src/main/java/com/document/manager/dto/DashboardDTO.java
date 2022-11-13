package com.document.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO implements Serializable {

    private long countUserActive;
    private long countUserNotActive;
    private long countDocument;
}
