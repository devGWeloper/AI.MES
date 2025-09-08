package com.ai.mes.controller;

import com.ai.mes.dto.ApiResponse;
import com.ai.mes.dto.LoginRequest;
import com.ai.mes.dto.LoginResponse;
import com.ai.mes.dto.UserInfo;
import com.ai.mes.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;
    
    private static final String JWT_COOKIE_NAME = "ai_mes_token";
    private static final int COOKIE_MAX_AGE = 24 * 60 * 60; // 24 hours

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "사용자 로그인을 처리합니다")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        
        log.info("로그인 요청: {}", loginRequest.getUsername());
        
        try {
            LoginResponse loginResponse = authService.login(loginRequest);
            
            // JWT를 HttpOnly 쿠키로 설정
            Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, loginResponse.getToken());
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // HTTPS 환경에서는 true로 설정
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(COOKIE_MAX_AGE);
            response.addCookie(jwtCookie);
            
            // 응답에서는 토큰을 제거 (보안상 클라이언트에서 직접 접근 불가)
            loginResponse.setToken("success");
            
            return ResponseEntity.ok(ApiResponse.success(loginResponse, "로그인에 성공했습니다"));
            
        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("로그인에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "사용자 로그아웃을 처리합니다")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        log.info("로그아웃 요청");
        
        try {
            authService.logout();
            
            // JWT 쿠키 삭제
            Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, "");
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(0);
            response.addCookie(jwtCookie);
            
            return ResponseEntity.ok(ApiResponse.success(null, "로그아웃이 완료되었습니다"));
            
        } catch (Exception e) {
            log.error("로그아웃 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("로그아웃에 실패했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "현재 사용자 정보", description = "현재 로그인한 사용자의 정보를 반환합니다")
    public ResponseEntity<ApiResponse<UserInfo>> getCurrentUser() {
        log.debug("현재 사용자 정보 요청");
        
        try {
            UserInfo userInfo = authService.getCurrentUser();
            
            if (userInfo == null) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("인증이 필요합니다"));
            }
            
            return ResponseEntity.ok(ApiResponse.success(userInfo));
            
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("사용자 정보를 조회할 수 없습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/validate")
    @Operation(summary = "토큰 유효성 검사", description = "JWT 토큰의 유효성을 검사합니다")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(HttpServletRequest request) {
        log.debug("토큰 유효성 검사 요청");
        
        try {
            String token = extractTokenFromCookie(request);
            
            if (token == null) {
                return ResponseEntity.ok(ApiResponse.success(false, "토큰이 없습니다"));
            }
            
            boolean isValid = authService.validateToken(token);
            String message = isValid ? "유효한 토큰입니다" : "유효하지 않은 토큰입니다";
            
            return ResponseEntity.ok(ApiResponse.success(isValid, message));
            
        } catch (Exception e) {
            log.error("토큰 유효성 검사 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("토큰 유효성 검사에 실패했습니다: " + e.getMessage()));
        }
    }
    
    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (JWT_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
