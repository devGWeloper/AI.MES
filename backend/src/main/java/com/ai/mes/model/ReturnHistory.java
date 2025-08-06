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
public class ReturnHistory {
    private String id;
    private String returnId;
    private String lotNumber;
    private String product;
    private String fab;
    private String returnReason;
    private String returnStep;
    private LocalDateTime returnDate;
    private String returnBy;
    private String targetStep;
    private String status;
    private String severity;
    private LocalDateTime resolvedDate;
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}