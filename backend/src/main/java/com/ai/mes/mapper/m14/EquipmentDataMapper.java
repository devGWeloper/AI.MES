package com.ai.mes.mapper.m14;

import com.ai.mes.model.EquipmentData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
@Component("m14EquipmentDataMapper")
public interface EquipmentDataMapper {
    
    // 기본 CRUD 작업
    List<EquipmentData> selectAll();
    
    EquipmentData selectById(@Param("id") String id);
    
    List<EquipmentData> selectByEquipmentId(@Param("equipmentId") String equipmentId);
    
    List<EquipmentData> selectByFab(@Param("fab") String fab);
    
    List<EquipmentData> selectByStatus(@Param("status") String status);
    
    List<EquipmentData> selectByDateRange(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    int insert(EquipmentData equipmentData);
    
    int update(EquipmentData equipmentData);
    
    int deleteById(@Param("id") String id);
    
    // 통계 및 분석 쿼리
    List<EquipmentData> selectByUtilizationRange(@Param("minUtilization") Integer minUtilization, 
                                                @Param("maxUtilization") Integer maxUtilization);
    
    List<EquipmentData> selectByTemperatureRange(@Param("minTemperature") Double minTemperature, 
                                                @Param("maxTemperature") Double maxTemperature);
    
    List<EquipmentData> selectByPressureRange(@Param("minPressure") Double minPressure, 
                                             @Param("maxPressure") Double maxPressure);
    
    List<EquipmentData> selectByMaintenanceDate(@Param("maintenanceDate") LocalDateTime maintenanceDate);
    
    List<EquipmentData> selectByCurrentOperation(@Param("currentOperation") String currentOperation);
    
    List<EquipmentData> selectByCurrentLot(@Param("currentLot") String currentLot);
    
    // 복합 조건 검색
    List<EquipmentData> selectByMultipleConditions(@Param("fab") String fab,
                                                  @Param("status") String status,
                                                  @Param("currentOperation") String currentOperation,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);
} 