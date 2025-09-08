package com.ai.mes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private String username;
    private String name;
    private String email;
    private String department;
    private String role;
}
