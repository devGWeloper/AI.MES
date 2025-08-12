package com.ai.mes.service;

import com.ai.mes.model.EquipmentData;
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
public class EquipmentService {

    // 각 팹 별 MyBatis Mapper 주입
    private final com.ai.mes.mapper.m14.EquipmentDataMapper m14EquipmentDataMapper;
    private final com.ai.mes.mapper.m15.EquipmentDataMapper m15EquipmentDataMapper;
    private final com.ai.mes.mapper.m16.EquipmentDataMapper m16EquipmentDataMapper;

    // Mock data for development - replace with actual database calls
    private List<EquipmentData> getMockEquipmentData() {
        List<EquipmentData> mockData = new ArrayList<>();
        
        mockData.add(new EquipmentData("1", "LITHO-001", "Lithography Scanner A", "M14", "running", 
                "Exposure", "LOT001", 85, LocalDateTime.now().minusDays(7), LocalDateTime.now().plusDays(3), 
                23.5, 1.2, "168시간", 0, "Exposure", 
                LocalDateTime.now().minusHours(3), LocalDateTime.now().minusHours(1), "2시간", "LOT001", "normal", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new EquipmentData("2", "ETCH-002", "Etching System B", "M15", "error", 
                "Maintenance", null, 45, LocalDateTime.now().minusDays(12), LocalDateTime.now().minusDays(4), 
                25.8, 0.9, "72시간", 3, "Dry Etch", 
                LocalDateTime.now().minusHours(6), LocalDateTime.now().minusHours(2), "4시간", "LOT002", "delayed", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new EquipmentData("3", "DEP-003", "Deposition Chamber C", "M16", "maintenance", 
                "Scheduled PM", null, 0, LocalDateTime.now(), LocalDateTime.now().plusDays(7), 
                22.1, 1.0, "0시간", 0, "CVD", 
                LocalDateTime.now().minusHours(2), null, "진행중", "LOT003", "error", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        mockData.add(new EquipmentData("4", "CMP-001", "CMP Polisher A", "M14", "idle", 
                null, null, 65, LocalDateTime.now().minusDays(4), LocalDateTime.now().plusDays(4), 
                24.2, 1.1, "120시간", 1, "Chemical Polishing", 
                LocalDateTime.now().minusHours(1), LocalDateTime.now(), "1시간", "LOT004", "normal", 
                LocalDateTime.now().minusDays(1), LocalDateTime.now()));
                
        return mockData;
    }

    public List<EquipmentData> getEquipmentHistory(String fab) {
        log.info("Getting equipment history for fab: {}", fab);
        List<EquipmentData> allEquipment = getMockEquipmentData();
        
        if (fab != null && !fab.isEmpty()) {
            return allEquipment.stream()
                    .filter(equipment -> fab.equals(equipment.getFab()))
                    .collect(Collectors.toList());
        }
        
        return allEquipment;
    }

    public List<EquipmentData> getEquipmentStatus(String fab) {
        log.info("Getting equipment status for fab: {}", fab);
        List<EquipmentData> allEquipment = getMockEquipmentData();
        
        if (fab != null && !fab.isEmpty()) {
            return allEquipment.stream()
                    .filter(equipment -> fab.equals(equipment.getFab()))
                    .collect(Collectors.toList());
        }
        
        return allEquipment;
    }

    public EquipmentData getEquipmentDetails(String equipmentId) {
        log.info("Getting equipment details for equipmentId: {}", equipmentId);
        return getMockEquipmentData().stream()
                .filter(equipment -> equipmentId.equals(equipment.getEquipmentId()))
                .findFirst()
                .orElse(null);
    }

    public List<EquipmentData> searchEquipment(String keyword, String fab, String status) {
        log.info("Searching equipment with keyword: {}, fab: {}, status: {}", keyword, fab, status);
        try {
            List<EquipmentData> results = new ArrayList<>();
            
            // 팹이 지정된 경우 해당 팹에서만 검색
            if (fab != null && !fab.isEmpty()) {
                results.addAll(searchEquipmentInFab(keyword, fab, status));
            } else {
                // 팹 미지정 시 모든 팹에서 검색
                results.addAll(searchEquipmentInFab(keyword, "M14", status));
                results.addAll(searchEquipmentInFab(keyword, "M15", status));
                results.addAll(searchEquipmentInFab(keyword, "M16", status));
            }
            
            // 생성일 최신순 정렬
            results.sort(Comparator.comparing(EquipmentData::getCreatedAt, 
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());
            
            log.debug("Equipment search completed. Found {} equipments", results.size());
            return results;
        } catch (Exception e) {
            log.error("DB search failed, falling back to mock. reason={}", e.getMessage(), e);
            // 폴백: 목 데이터에서 검색
            return getMockEquipmentData().stream()
                    .filter(equipment -> {
                        boolean matches = true;
                        if (keyword != null && !keyword.isEmpty()) {
                            matches = equipment.getEquipmentId().toLowerCase().contains(keyword.toLowerCase()) ||
                                     equipment.getEquipmentName().toLowerCase().contains(keyword.toLowerCase());
                        }
                        if (fab != null && !fab.isEmpty()) {
                            matches = matches && fab.equals(equipment.getFab());
                        }
                        if (status != null && !status.isEmpty()) {
                            matches = matches && status.equals(equipment.getStatus());
                        }
                        return matches;
                    })
                    .collect(Collectors.toList());
        }
    }

    private List<EquipmentData> searchEquipmentInFab(String keyword, String fab, String status) {
        try {
            List<EquipmentData> results = new ArrayList<>();
            
            // 키워드가 있으면 설비 ID로 검색
            if (keyword != null && !keyword.isEmpty()) {
                switch (fab) {
                    case "M14":
                        // 설비 ID로 검색하는 매퍼 메서드 호출
                        results.addAll(m14EquipmentDataMapper.selectByEquipmentId(keyword));
                        break;
                    case "M15":
                        results.addAll(m15EquipmentDataMapper.selectByEquipmentId(keyword));
                        break;
                    case "M16":
                        results.addAll(m16EquipmentDataMapper.selectByEquipmentId(keyword));
                        break;
                }
            }
            
            // 상태 필터 적용
            if (status != null && !status.isEmpty()) {
                results = results.stream()
                        .filter(equipment -> status.equals(equipment.getStatus()))
                        .collect(Collectors.toList());
            }
            
            return results;
        } catch (Exception e) {
            log.warn("Equipment search failed for fab {} with keyword {}: {}", fab, keyword, e.getMessage());
            return new ArrayList<>();
        }
    }

    public EquipmentData updateEquipmentStatus(String equipmentId, String status) {
        log.info("Updating equipment status for equipmentId: {} to status: {}", equipmentId, status);
        
        // In real implementation, this would update the database
        EquipmentData equipment = getEquipmentDetails(equipmentId);
        if (equipment != null) {
            equipment.setStatus(status);
            equipment.setUpdatedAt(LocalDateTime.now());
        }
        
        return equipment;
    }
}