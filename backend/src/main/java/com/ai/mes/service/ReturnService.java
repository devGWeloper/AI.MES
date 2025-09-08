package com.ai.mes.service;

import com.ai.mes.model.ReturnHistory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnService {

    // 각 팹 별 MyBatis Mapper 주입
    private final com.ai.mes.mapper.m14.ReturnHistoryMapper m14ReturnHistoryMapper;
    private final com.ai.mes.mapper.m15.ReturnHistoryMapper m15ReturnHistoryMapper;
    private final com.ai.mes.mapper.m16.ReturnHistoryMapper m16ReturnHistoryMapper;

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

    public List<ReturnHistory> getReturnHistory(String fab, String keyword) {
        log.info("Getting return history for fab: {}, keyword: {}", fab, keyword);
        try {
            List<ReturnHistory> results = new ArrayList<>();
            
            // 키워드 검색 로직 추가
            if (keyword != null && !keyword.trim().isEmpty()) {
                // 팹이 지정된 경우 해당 팹에서만 검색
                if (fab != null && !fab.isEmpty()) {
                    results.addAll(searchReturnInFab(keyword, fab));
                } else {
                    // 팹 미지정 시 모든 팹에서 병렬 검색
                    CompletableFuture<List<ReturnHistory>> m14SearchFuture = CompletableFuture
                        .supplyAsync(() -> searchReturnInFab(keyword, "M14"));
                    CompletableFuture<List<ReturnHistory>> m15SearchFuture = CompletableFuture
                        .supplyAsync(() -> searchReturnInFab(keyword, "M15"));
                    CompletableFuture<List<ReturnHistory>> m16SearchFuture = CompletableFuture
                        .supplyAsync(() -> searchReturnInFab(keyword, "M16"));
                    
                    results.addAll(m14SearchFuture.join());
                    results.addAll(m15SearchFuture.join());
                    results.addAll(m16SearchFuture.join());
                }
            } else {
                // 키워드 없이 팹별 전체 조회
                if (fab != null && !fab.isEmpty()) {
                    results.addAll(fetchReturnByFab(fab));
                } else {
                    // 팹 미지정 시 전체 팹에서 병렬 조회
                    CompletableFuture<List<ReturnHistory>> m14Future = CompletableFuture
                        .supplyAsync(() -> safeSelectAllReturns(m14ReturnHistoryMapper, "M14"));
                    CompletableFuture<List<ReturnHistory>> m15Future = CompletableFuture
                        .supplyAsync(() -> safeSelectAllReturns(m15ReturnHistoryMapper, "M15"));
                    CompletableFuture<List<ReturnHistory>> m16Future = CompletableFuture
                        .supplyAsync(() -> safeSelectAllReturns(m16ReturnHistoryMapper, "M16"));
                    
                    results.addAll(m14Future.join());
                    results.addAll(m15Future.join());
                    results.addAll(m16Future.join());
                }
            }
            
            // 반송일 최신순 정렬
            results.sort(Comparator.comparing(ReturnHistory::getReturnDate, 
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());
            
            log.debug("Return history fetched. Found {} returns", results.size());
            return results;
        } catch (Exception e) {
            log.error("DB fetch failed, falling back to mock. reason={}", e.getMessage(), e);
            return getMockReturnData();
        }
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

    private List<ReturnHistory> searchReturnInFab(String keyword, String fab) {
        try {
            List<ReturnHistory> results = new ArrayList<>();
            
            // 키워드가 있으면 반송ID나 LOT번호로 검색
            if (keyword != null && !keyword.isEmpty()) {
                switch (fab) {
                    case "M14":
                        // 반송ID로 검색
                        List<ReturnHistory> returnsByReturnId = m14ReturnHistoryMapper.selectByReturnId(keyword);
                        if (returnsByReturnId != null) results.addAll(returnsByReturnId);
                        // LOT번호로도 검색
                        results.addAll(m14ReturnHistoryMapper.selectByLotNumber(keyword));
                        break;
                    case "M15":
                        returnsByReturnId = m15ReturnHistoryMapper.selectByReturnId(keyword);
                        if (returnsByReturnId != null) results.addAll(returnsByReturnId);
                        results.addAll(m15ReturnHistoryMapper.selectByLotNumber(keyword));
                        break;
                    case "M16":
                        returnsByReturnId = m16ReturnHistoryMapper.selectByReturnId(keyword);
                        if (returnsByReturnId != null) results.addAll(returnsByReturnId);
                        results.addAll(m16ReturnHistoryMapper.selectByLotNumber(keyword));
                        break;
                }
            }
            
            return results;
        } catch (Exception e) {
            log.warn("Return search failed for fab {} with keyword {}: {}", fab, keyword, e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<ReturnHistory> fetchReturnByFab(String fab) {
        switch (fab) {
            case "M14":
                return m14ReturnHistoryMapper.selectByFab("M14");
            case "M15":
                return m15ReturnHistoryMapper.selectByFab("M15");
            case "M16":
                return m16ReturnHistoryMapper.selectByFab("M16");
            default:
                log.warn("Unknown fab: {}. Returning empty list.", fab);
                return new ArrayList<>();
        }
    }

    private List<ReturnHistory> safeSelectAllReturns(Object mapper, String fabLabel) {
        try {
            if (mapper instanceof com.ai.mes.mapper.m14.ReturnHistoryMapper) {
                return ((com.ai.mes.mapper.m14.ReturnHistoryMapper) mapper).selectAll();
            } else if (mapper instanceof com.ai.mes.mapper.m15.ReturnHistoryMapper) {
                return ((com.ai.mes.mapper.m15.ReturnHistoryMapper) mapper).selectAll();
            } else if (mapper instanceof com.ai.mes.mapper.m16.ReturnHistoryMapper) {
                return ((com.ai.mes.mapper.m16.ReturnHistoryMapper) mapper).selectAll();
            }
        } catch (Exception e) {
            log.warn("selectAll failed for {} return datasource: {}", fabLabel, e.getMessage());
        }
        return new ArrayList<>();
    }
}