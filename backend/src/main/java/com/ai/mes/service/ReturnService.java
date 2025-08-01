package com.ai.mes.service;

import com.ai.mes.model.ReturnHistory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnService {

    // Mock data for development - replace with actual database calls
    private List<ReturnHistory> getMockReturnData() {
        List<ReturnHistory> mockData = new ArrayList<>();
        
        mockData.add(new ReturnHistory("1", "RET-001", "LOT001", "Product A", "M14", "품질 불량", 
                "Lithography", LocalDateTime.now().minusHours(10), "김품질", "Clean", "resolved", "High", 
                LocalDateTime.now().minusHours(8), "PR 두께 재조정 후 재처리 완료", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new ReturnHistory("2", "RET-002", "LOT002", "Product B", "M15", "설비 오염", 
                "Etching", LocalDateTime.now().minusHours(13), "이공정", "Pre-Clean", "processing", "Medium", 
                null, "챔버 클리닝 후 재진입 예정", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new ReturnHistory("3", "RET-003", "LOT003", "Product C", "M16", "측정값 이상", 
                "Measurement", LocalDateTime.now().minusHours(14), "박측정", "CMP", "analyzing", "Low", 
                null, "재측정 결과 대기 중", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new ReturnHistory("4", "RET-004", "LOT004", "Product A", "M14", "공정 파라미터 오류", 
                "Deposition", LocalDateTime.now().minusHours(32), "최공정", "Strip", "resolved", "High", 
                LocalDateTime.now().minusHours(16), "레시피 수정 후 재처리 완료", 
                LocalDateTime.now().minusDays(2), LocalDateTime.now()));
                
        return mockData;
    }

    public List<ReturnHistory> getReturnHistory(String fab) {
        log.info("Getting return history for fab: {}", fab);
        List<ReturnHistory> allReturns = getMockReturnData();
        
        if (fab != null && !fab.isEmpty()) {
            return allReturns.stream()
                    .filter(returnHistory -> fab.equals(returnHistory.getFab()))
                    .collect(Collectors.toList());
        }
        
        return allReturns;
    }

    public ReturnHistory createReturn(ReturnHistory returnHistory) {
        log.info("Creating new return for lot: {}", returnHistory.getLotNumber());
        
        // In real implementation, this would save to database
        returnHistory.setId(UUID.randomUUID().toString());
        returnHistory.setReturnId("RET-" + String.format("%03d", (int)(Math.random() * 1000)));
        returnHistory.setReturnDate(LocalDateTime.now());
        returnHistory.setCreatedAt(LocalDateTime.now());
        returnHistory.setUpdatedAt(LocalDateTime.now());
        
        return returnHistory;
    }

    public ReturnHistory updateReturnStatus(String returnId, String status) {
        log.info("Updating return status for returnId: {} to status: {}", returnId, status);
        
        // In real implementation, this would update the database
        ReturnHistory returnHistory = getReturnDetails(returnId);
        if (returnHistory != null) {
            returnHistory.setStatus(status);
            returnHistory.setUpdatedAt(LocalDateTime.now());
            
            if ("resolved".equals(status)) {
                returnHistory.setResolvedDate(LocalDateTime.now());
            }
        }
        
        return returnHistory;
    }

    public ReturnHistory getReturnDetails(String returnId) {
        log.info("Getting return details for returnId: {}", returnId);
        return getMockReturnData().stream()
                .filter(returnHistory -> returnId.equals(returnHistory.getReturnId()))
                .findFirst()
                .orElse(null);
    }

    public List<ReturnHistory> searchReturns(String keyword, String fab, String status, String severity) {
        log.info("Searching returns with keyword: {}, fab: {}, status: {}, severity: {}", 
                keyword, fab, status, severity);
        List<ReturnHistory> allReturns = getMockReturnData();
        
        return allReturns.stream()
                .filter(returnHistory -> {
                    boolean matches = true;
                    
                    if (keyword != null && !keyword.isEmpty()) {
                        matches = returnHistory.getReturnId().toLowerCase().contains(keyword.toLowerCase()) ||
                                 returnHistory.getLotNumber().toLowerCase().contains(keyword.toLowerCase()) ||
                                 returnHistory.getReturnReason().toLowerCase().contains(keyword.toLowerCase());
                    }
                    
                    if (fab != null && !fab.isEmpty()) {
                        matches = matches && fab.equals(returnHistory.getFab());
                    }
                    
                    if (status != null && !status.isEmpty()) {
                        matches = matches && status.equals(returnHistory.getStatus());
                    }
                    
                    if (severity != null && !severity.isEmpty()) {
                        matches = matches && severity.equals(returnHistory.getSeverity());
                    }
                    
                    return matches;
                })
                .collect(Collectors.toList());
    }
}