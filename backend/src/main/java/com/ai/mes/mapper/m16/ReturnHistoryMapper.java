package com.ai.mes.mapper.m16;

import com.ai.mes.model.ReturnHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
@Component("m16ReturnHistoryMapper")
public interface ReturnHistoryMapper {
    
    // 기본 CRUD 작업
    List<ReturnHistory> selectAll();
    
    ReturnHistory selectById(@Param("id") String id);
    
    List<ReturnHistory> selectByReturnId(@Param("returnId") String returnId);
    
    List<ReturnHistory> selectByLotNumber(@Param("lotNumber") String lotNumber);
    
    List<ReturnHistory> selectByFab(@Param("fab") String fab);
    
    List<ReturnHistory> selectByStatus(@Param("status") String status);
    
    List<ReturnHistory> selectByProduct(@Param("product") String product);
    
    List<ReturnHistory> selectByDateRange(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    int insert(ReturnHistory returnHistory);
    
    int update(ReturnHistory returnHistory);
    
    int deleteById(@Param("id") String id);
    
    // 반품 관련 쿼리
    List<ReturnHistory> selectByReturnReason(@Param("returnReason") String returnReason);
    
    List<ReturnHistory> selectByReturnStep(@Param("returnStep") String returnStep);
    
    List<ReturnHistory> selectByReturnBy(@Param("returnBy") String returnBy);
    
    List<ReturnHistory> selectByTargetStep(@Param("targetStep") String targetStep);
    
    List<ReturnHistory> selectBySeverity(@Param("severity") String severity);
    
    List<ReturnHistory> selectByReturnDate(@Param("returnDate") LocalDateTime returnDate);
    
    List<ReturnHistory> selectByResolvedDate(@Param("resolvedDate") LocalDateTime resolvedDate);
    
    // 복합 조건 검색
    List<ReturnHistory> selectByMultipleConditions(@Param("fab") String fab,
                                                 @Param("status") String status,
                                                 @Param("product") String product,
                                                 @Param("returnReason") String returnReason,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
    
    // 해결되지 않은 반품 이력
    List<ReturnHistory> selectUnresolvedReturns();
    
    // 특정 기간 내 반품 이력
    List<ReturnHistory> selectByReturnDateRange(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    // 특정 기간 내 해결된 반품 이력
    List<ReturnHistory> selectByResolvedDateRange(@Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
} 