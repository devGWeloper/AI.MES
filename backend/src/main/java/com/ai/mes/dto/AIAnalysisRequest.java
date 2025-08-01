package com.ai.mes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisRequest {
    private String context;
    private Object data;
    private String type;
    private String fab;
}