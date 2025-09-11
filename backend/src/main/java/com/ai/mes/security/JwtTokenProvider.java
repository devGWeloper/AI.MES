package com.ai.mes.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final int jwtExpirationInMs;

    public JwtTokenProvider(@Value("${spring.security.jwt.secret}") String jwtSecret,
                           @Value("${spring.security.jwt.expiration}") int jwtExpirationInMs) {
        try {
            // JWT secret이 null이거나 빈 문자열인지 확인
            if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
                throw new IllegalArgumentException("JWT secret이 설정되지 않았습니다.");
            }
            
            // 최소 길이 확인 (HMAC-SHA512용으로 64바이트 권장)
            byte[] secretBytes = jwtSecret.getBytes();
            if (secretBytes.length < 32) {
                log.warn("JWT secret이 권장 길이보다 짧습니다. 현재: {}바이트, 권장: 64바이트", secretBytes.length);
            }
            
            this.key = Keys.hmacShaKeyFor(secretBytes);
            this.jwtExpirationInMs = jwtExpirationInMs;
            
            log.info("JWT TokenProvider 초기화 완료. Secret 길이: {}바이트, 만료시간: {}ms", 
                    secretBytes.length, jwtExpirationInMs);
                    
        } catch (Exception e) {
            log.error("JWT TokenProvider 초기화 실패: {}", e.getMessage());
            throw new IllegalArgumentException("JWT 설정 오류: " + e.getMessage(), e);
        }
    }

    public String generateToken(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                throw new IllegalArgumentException("인증 정보가 null입니다.");
            }
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            if (userPrincipal.getUsername() == null || userPrincipal.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("사용자명이 null이거나 빈 문자열입니다.");
            }
            
            Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

            String token = Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(expiryDate)
                    .signWith(key, SignatureAlgorithm.HS512)
                    .compact();
                    
            log.debug("JWT 토큰 생성 성공: 사용자={}", userPrincipal.getUsername());
            return token;
            
        } catch (Exception e) {
            log.error("JWT 토큰 생성 실패: {}", e.getMessage());
            throw new IllegalArgumentException("JWT 토큰 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }
}