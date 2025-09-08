package com.ai.mes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "사용자명을 입력해주세요")
    @Size(min = 3, max = 50, message = "사용자명은 3-50자 사이여야 합니다")
    private String username;
    
    @NotBlank(message = "비밀번호를 입력해주세요")
    @Size(min = 4, message = "비밀번호는 최소 4자 이상이어야 합니다")
    private String password;
}
