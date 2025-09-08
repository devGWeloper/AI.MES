package com.ai.mes.mapper.next;

import com.ai.mes.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Mapper
@Component("nextUserMapper")
public interface UserMapper {
    
    // 로그인 관련 메서드
    Optional<User> selectByUsername(@Param("username") String username);
    
    Optional<User> selectByUsernameAndPassword(@Param("username") String username, 
                                              @Param("password") String password);
    
    // 사용자 정보 조회
    Optional<User> selectById(@Param("id") Long id);
    
    Optional<User> selectByEmail(@Param("email") String email);
    
    // 마지막 로그인 시간 업데이트
    int updateLastLoginAt(@Param("username") String username, 
                         @Param("lastLoginAt") LocalDateTime lastLoginAt);
    
    // 활성 상태 확인
    boolean isActiveUser(@Param("username") String username);
    
    // 사용자 존재 여부 확인
    boolean existsByUsername(@Param("username") String username);
    
    boolean existsByEmail(@Param("email") String email);
}
