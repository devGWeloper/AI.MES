package com.ai.mes.mapper.m16;

import com.ai.mes.model.LotData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
@Component("m16LotDataMapper")
public interface LotDataMapper {
    
    // 기본 CRUD 작업
    List<LotData> selectAll();
    
    LotData selectById(@Param("id") String id);
    
    List<LotData> selectByLotNumber(@Param("lotNumber") String lotNumber);
    
    List<LotData> selectByFab(@Param("fab") String fab);
    
    List<LotData> selectByStatus(@Param("status") String status);
    
    List<LotData> selectByProduct(@Param("product") String product);
    
    List<LotData> selectByDateRange(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    int insert(LotData lotData);
    
    int update(LotData lotData);
    
    int deleteById(@Param("id") String id);
    
    // 공정 관련 쿼리
    List<LotData> selectByStep(@Param("step") String step);
    
    List<LotData> selectByEquipment(@Param("equipment") String equipment);
    
    List<LotData> selectByProgressRange(@Param("minProgress") Integer minProgress, 
                                       @Param("maxProgress") Integer maxProgress);
    
    List<LotData> selectByEstimatedCompletion(@Param("estimatedCompletion") LocalDateTime estimatedCompletion);
    
    List<LotData> selectByResult(@Param("result") String result);
    
    // 복합 조건 검색
    List<LotData> selectByMultipleConditions(@Param("fab") String fab,
                                           @Param("status") String status,
                                           @Param("product") String product,
                                           @Param("step") String step,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
    
    // 진행률 기반 검색
    List<LotData> selectByProgressStatus(@Param("progress") Integer progress);
    
    List<LotData> selectByDurationRange(@Param("minDuration") String minDuration, 
                                       @Param("maxDuration") String maxDuration);
} 