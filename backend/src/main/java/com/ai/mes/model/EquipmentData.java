package com.ai.mes.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentData {
    private String id;
    private String equipmentId;
    private String equipmentName;
    private String fab;
    private String status;
    private String currentOperation;
    private String currentLot;
    private Integer utilization;
    private LocalDateTime lastMaintenance;
    private LocalDateTime nextMaintenance;
    private Double temperature;
    private Double pressure;
    private String uptime;
    private Integer alerts;
    private String operation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String duration;
    private String lotNumber;
    private String result;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}