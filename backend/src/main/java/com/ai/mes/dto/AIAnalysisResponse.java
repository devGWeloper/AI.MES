package com.ai.mes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    private String analysis;
    private List<String> recommendations;
    private List<String> alerts;
    private LocalDateTime timestamp;
}