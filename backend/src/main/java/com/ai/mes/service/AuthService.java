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
        // 보안을 위해 사용자명만 로그에 기록 (LoginRequest 전체 객체는 로그에 남기지 않음)
        log.info("로그인 시도: {}", loginRequest.getUsername());
        
        try {
            // 사용자 존재 여부 및 활성 상태 확인
            Optional<User> userOptional = userMapper.selectByUsername(loginRequest.getUsername());
            if (userOptional.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", loginRequest.getUsername());
                throw new BadCredentialsException("잘못된 사용자명 또는 비밀번호입니다.");
            }
            
            User user = userOptional.get();
            
            // 비밀번호 검증 (민감한 정보는 로그에 남기지 않음)
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                log.warn("인증 실패 - 사용자: {}", loginRequest.getUsername());
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
            
        } catch (BadCredentialsException e) {
            // 인증 실패는 구체적인 에러 메시지를 로그에 남기지 않음 (보안상 이유)
            log.warn("로그인 인증 실패 - 사용자: {}", loginRequest.getUsername());
            throw e;
        } catch (Exception e) {
            // 시스템 에러만 상세 로그 기록 (비밀번호 관련 정보는 제외)
            log.error("로그인 시스템 오류 - 사용자: {} | 오류: {}", 
                loginRequest.getUsername(), e.getClass().getSimpleName());
            throw new BadCredentialsException("로그인 처리 중 오류가 발생했습니다.");
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
