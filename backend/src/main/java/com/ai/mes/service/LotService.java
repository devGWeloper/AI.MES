package com.ai.mes.service;

import com.ai.mes.model.LotData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LotService {

    // 각 팹 별 MyBatis Mapper 주입 (패키지 경로를 타입으로 사용)
    private final com.ai.mes.mapper.m14.LotDataMapper m14LotDataMapper;
    private final com.ai.mes.mapper.m15.LotDataMapper m15LotDataMapper;
    private final com.ai.mes.mapper.m16.LotDataMapper m16LotDataMapper;

    // Mock data for development - replace with actual database calls
    private List<LotData> getMockLotData() {
        List<LotData> mockData = new ArrayList<>();
        
        mockData.add(new LotData("1", "LOT001", "Product A", "M14", "completed", 
                LocalDateTime.now().minusHours(8), LocalDateTime.now().minusHours(2), 
                "Step 5", "EQP-001", 100, null, "6시간", "normal", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new LotData("2", "LOT002", "Product B", "M15", "in_progress", 
                LocalDateTime.now().minusHours(4), null, 
                "Step 3", "EQP-002", 45, LocalDateTime.now().plusHours(4), "진행중", "delayed", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new LotData("3", "LOT003", "Product C", "M16", "waiting", 
                LocalDateTime.now().minusHours(2), null, 
                "Step 1", "EQP-003", 12, LocalDateTime.now().plusHours(6), "대기중", "normal", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        return mockData;
    }

    public List<LotData> getLotHistory(String fab) {
        log.info("Getting lot history for fab: {}", fab);
        try {
            if (fab != null && !fab.isEmpty()) {
                List<LotData> result = fetchByFab(fab);
                log.debug("Fetched {} rows from {} datasource", result.size(), fab);
                return result;
            }
            // fab 미지정 시 전체 팹에서 취합
            List<LotData> merged = new ArrayList<>();
            merged.addAll(safeSelectAll(m14LotDataMapper, "M14"));
            merged.addAll(safeSelectAll(m15LotDataMapper, "M15"));
            merged.addAll(safeSelectAll(m16LotDataMapper, "M16"));
            // 생성일 최신순 정렬 (null 안전)
            merged.sort(Comparator.comparing(LotData::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
            log.debug("Merged rows across fabs: {}", merged.size());
            return merged;
        } catch (Exception e) {
            log.error("DB fetch failed, falling back to mock. reason={}", e.getMessage(), e);
            return getMockLotData();
        }
    }

    public List<LotData> getLotStatus(String fab) {
        log.info("Getting lot status for fab: {}", fab);
        List<LotData> allLots = getMockLotData();
        
        // Only return active lots (in_progress or waiting)
        List<LotData> activeLots = allLots.stream()
                .filter(lot -> "in_progress".equals(lot.getStatus()) || "waiting".equals(lot.getStatus()))
                .collect(Collectors.toList());
        
        if (fab != null && !fab.isEmpty()) {
            return activeLots.stream()
                    .filter(lot -> fab.equals(lot.getFab()))
                    .collect(Collectors.toList());
        }
        
        return activeLots;
    }

    public LotData getLotDetails(String lotNumber) {
        log.info("Getting lot details for lotNumber: {}", lotNumber);
        return getMockLotData().stream()
                .filter(lot -> lotNumber.equals(lot.getLotNumber()))
                .findFirst()
                .orElse(null);
    }

    public List<LotData> searchLots(String keyword, String fab, String status) {
        log.info("Searching lots with keyword: {}, fab: {}, status: {}", keyword, fab, status);
        try {
            List<LotData> results = new ArrayList<>();
            
            // 팹이 지정된 경우 해당 팹에서만 검색
            if (fab != null && !fab.isEmpty()) {
                results.addAll(searchInFab(keyword, fab, status));
            } else {
                // 팹 미지정 시 모든 팹에서 검색
                results.addAll(searchInFab(keyword, "M14", status));
                results.addAll(searchInFab(keyword, "M15", status));
                results.addAll(searchInFab(keyword, "M16", status));
            }
            
            // 생성일 최신순 정렬
            results.sort(Comparator.comparing(LotData::getCreatedAt, 
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());
            
            log.debug("Search completed. Found {} lots", results.size());
            return results;
        } catch (Exception e) {
            log.error("DB search failed, falling back to mock. reason={}", e.getMessage(), e);
            // 폴백: 목 데이터에서 검색
            return getMockLotData().stream()
                    .filter(lot -> {
                        boolean matches = true;
                        if (keyword != null && !keyword.isEmpty()) {
                            matches = lot.getLotNumber().toLowerCase().contains(keyword.toLowerCase()) ||
                                     lot.getProduct().toLowerCase().contains(keyword.toLowerCase());
                        }
                        if (fab != null && !fab.isEmpty()) {
                            matches = matches && fab.equals(lot.getFab());
                        }
                        if (status != null && !status.isEmpty()) {
                            matches = matches && status.equals(lot.getStatus());
                        }
                        return matches;
                    })
                    .collect(Collectors.toList());
        }
    }

    private List<LotData> searchInFab(String keyword, String fab, String status) {
        try {
            List<LotData> results = new ArrayList<>();
            
            // 키워드가 있으면 LOT 번호로 검색
            if (keyword != null && !keyword.isEmpty()) {
                switch (fab) {
                    case "M14":
                        results.addAll(m14LotDataMapper.selectByLotNumber(keyword));
                        break;
                    case "M15":
                        results.addAll(m15LotDataMapper.selectByLotNumber(keyword));
                        break;
                    case "M16":
                        results.addAll(m16LotDataMapper.selectByLotNumber(keyword));
                        break;
                }
            }
            
            // 상태 필터 적용 (클라이언트에서 추가 필터링)
            if (status != null && !status.isEmpty()) {
                results = results.stream()
                        .filter(lot -> status.equals(lot.getStatus()))
                        .collect(Collectors.toList());
            }
            
            return results;
        } catch (Exception e) {
            log.warn("Search failed for fab {} with keyword {}: {}", fab, keyword, e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<LotData> fetchByFab(String fab) {
        switch (fab) {
            case "M14":
                return m14LotDataMapper.selectByFab("M14");
            case "M15":
                return m15LotDataMapper.selectByFab("M15");
            case "M16":
                return m16LotDataMapper.selectByFab("M16");
            default:
                log.warn("Unknown fab: {}. Returning empty list.", fab);
                return new ArrayList<>();
        }
    }

    private List<LotData> safeSelectAll(Object mapper, String fabLabel) {
        try {
            if (mapper instanceof com.ai.mes.mapper.m14.LotDataMapper) {
                return ((com.ai.mes.mapper.m14.LotDataMapper) mapper).selectAll();
            } else if (mapper instanceof com.ai.mes.mapper.m15.LotDataMapper) {
                return ((com.ai.mes.mapper.m15.LotDataMapper) mapper).selectAll();
            } else if (mapper instanceof com.ai.mes.mapper.m16.LotDataMapper) {
                return ((com.ai.mes.mapper.m16.LotDataMapper) mapper).selectAll();
            }
        } catch (Exception e) {
            log.warn("selectAll failed for {} datasource: {}", fabLabel, e.getMessage());
        }
        return new ArrayList<>();
    }
}