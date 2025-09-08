package com.ai.mes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String name;
    private String email;
    private String department;
    private String role;
    private long expiresIn; // seconds
}
