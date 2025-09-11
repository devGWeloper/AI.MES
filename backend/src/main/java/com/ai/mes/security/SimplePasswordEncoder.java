package com.ai.mes.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

/**
 * 사내 시스템과 호환되는 간단한 패스워드 인코더
 * 가장 일반적인 암호화 방식들을 지원합니다.
 */
@Slf4j
@Component
public class SimplePasswordEncoder implements org.springframework.security.crypto.password.PasswordEncoder {

    /**
     * 새로운 비밀번호 암호화 (회원가입시 사용)
     * 기본적으로 평문 그대로 저장 (사내 시스템이 평문인 경우)
     */
    @Override
    public String encode(CharSequence rawPassword) {
        if (rawPassword == null) {
            return null;
        }
        
        // 사내 시스템에 맞게 수정 가능한 부분
        // 1. 평문 저장 (가장 간단한 방식)
        return rawPassword.toString();
        
        // 2. MD5 해시 (간단한 암호화가 필요한 경우)
        // return hashWithMD5(rawPassword.toString());
        
        // 3. SHA-256 해시 (좀 더 안전한 암호화가 필요한 경우)
        // return hashWithSHA256(rawPassword.toString());
    }

    /**
     * 비밀번호 검증
     * 사내 DB의 암호화 방식에 맞게 비교
     */
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        
        String rawPasswordStr = rawPassword.toString();
        
        // 방법 1: 평문 비교 (사내 DB가 평문인 경우)
        if (rawPasswordStr.equals(encodedPassword)) {
            return true;
        }
        
        // 방법 2: MD5 해시 비교 (사내 DB가 MD5인 경우)
        if (hashWithMD5(rawPasswordStr).equals(encodedPassword)) {
            return true;
        }
        
        // 방법 3: SHA-256 해시 비교 (사내 DB가 SHA-256인 경우)
        if (hashWithSHA256(rawPasswordStr).equals(encodedPassword)) {
            return true;
        }
        
        // 방법 4: SHA-256 + 대문자 변환 (일부 시스템에서 사용)
        if (hashWithSHA256(rawPasswordStr).toUpperCase().equals(encodedPassword)) {
            return true;
        }
        
        // 방법 5: MD5 + 대문자 변환 (일부 시스템에서 사용)
        if (hashWithMD5(rawPasswordStr).toUpperCase().equals(encodedPassword)) {
            return true;
        }
        
        log.debug("비밀번호 검증 실패 - 지원하는 암호화 방식과 일치하지 않음");
        return false;
    }
    
    /**
     * MD5 해시 생성 (간단한 암호화)
     */
    private String hashWithMD5(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("MD5 알고리즘을 찾을 수 없습니다", e);
            return password; // 실패시 평문 반환
        }
    }
    
    /**
     * SHA-256 해시 생성 (안전한 암호화)
     */
    private String hashWithSHA256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 알고리즘을 찾을 수 없습니다", e);
            return password; // 실패시 평문 반환
        }
    }
    
    /**
     * 바이트 배열을 16진수 문자열로 변환
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
