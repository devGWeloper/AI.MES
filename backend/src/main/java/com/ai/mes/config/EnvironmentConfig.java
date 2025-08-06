package com.ai.mes.config;

import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@Configuration
public class EnvironmentConfig {

    @PostConstruct
    public void loadEnvironmentVariables() {
        // .env.local 파일이 존재하면 로드
        File envFile = new File(".env.local");
        if (envFile.exists()) {
            Properties props = new Properties();
            try (FileInputStream fis = new FileInputStream(envFile)) {
                props.load(fis);
                props.forEach((key, value) -> {
                    if (System.getProperty((String) key) == null) {
                        System.setProperty((String) key, (String) value);
                    }
                });
                System.out.println("Successfully loaded .env.local file");
            } catch (IOException e) {
                System.err.println("Failed to load .env.local file: " + e.getMessage());
            }
        } else {
            System.out.println(".env.local file not found, using system environment variables");
        }
    }
} 