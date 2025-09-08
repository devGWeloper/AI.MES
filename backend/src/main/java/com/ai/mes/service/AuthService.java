package com.ai.mes.service;

import com.ai.mes.dto.LoginRequest;
import com.ai.mes.dto.LoginResponse;
import com.ai.mes.dto.UserInfo;
import com.ai.mes.mapper.next.UserMapper;
import com.ai.mes.model.User;
import com.ai.mes.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${spring.security.jwt.expiration}")
    private int jwtExpirationInMs;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("로그인 시도: {}", loginRequest.getUsername());
        
        try {
            // 사용자 존재 여부 및 활성 상태 확인
            Optional<User> userOptional = userMapper.selectByUsername(loginRequest.getUsername());
            if (userOptional.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", loginRequest.getUsername());
                throw new BadCredentialsException("잘못된 사용자명 또는 비밀번호입니다.");
            }
            
            User user = userOptional.get();
            
            // 비밀번호 검증
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                log.warn("비밀번호 불일치: {}", loginRequest.getUsername());
                throw new BadCredentialsException("잘못된 사용자명 또는 비밀번호입니다.");
            }
            
            // Spring Security 인증 처리
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // JWT 토큰 생성
            String token = jwtTokenProvider.generateToken(authentication);
            
            // 마지막 로그인 시간 업데이트
            userMapper.updateLastLoginAt(user.getUsername(), LocalDateTime.now());
            
            log.info("로그인 성공: {}", loginRequest.getUsername());
            
            return new LoginResponse(
                token,
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getDepartment(),
                user.getRole(),
                jwtExpirationInMs / 1000 // seconds
            );
            
        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            throw new BadCredentialsException("로그인에 실패했습니다: " + e.getMessage());
        }
    }
    
    public UserInfo getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String username = authentication.getName();
        Optional<User> userOptional = userMapper.selectByUsername(username);
        
        if (userOptional.isEmpty()) {
            return null;
        }
        
        User user = userOptional.get();
        return new UserInfo(
            user.getUsername(),
            user.getName(),
            user.getEmail(),
            user.getDepartment(),
            user.getRole()
        );
    }
    
    public void logout() {
        SecurityContextHolder.clearContext();
        log.info("사용자 로그아웃");
    }
    
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
    
    public String getUsernameFromToken(String token) {
        return jwtTokenProvider.getUsernameFromToken(token);
    }
}
