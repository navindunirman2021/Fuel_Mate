package com.uokmit.fuelmate.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerificationResponse {
    private String status;
    private String message;
} 