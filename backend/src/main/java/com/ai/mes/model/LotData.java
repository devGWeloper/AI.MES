package com.ai.mes.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class LotData {
    private String id;
    private String lotNumber;
    private String product;
    private String fab;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String step;
    private String equipment;
    private Integer progress;
    private LocalDateTime estimatedCompletion;
    private String duration;
    private String result;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}