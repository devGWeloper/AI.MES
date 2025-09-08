package com.ai.mes.security;

import com.ai.mes.mapper.next.UserMapper;
import com.ai.mes.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("사용자 로드 시도: {}", username);
        
        Optional<User> userOptional = userMapper.selectByUsername(username);
        if (userOptional.isEmpty()) {
            log.warn("사용자를 찾을 수 없음: {}", username);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        
        User user = userOptional.get();
        log.debug("사용자 로드 성공: {}", username);
        
        return UserPrincipal.create(
            user.getId().toString(),
            user.getUsername(), 
            user.getPassword(), 
            user.getEmail(),
            user.getRole()
        );
    }
}