package com.ai.mes.service;

import com.ai.mes.model.LotData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LotService {

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
        List<LotData> allLots = getMockLotData();
        
        if (fab != null && !fab.isEmpty()) {
            return allLots.stream()
                    .filter(lot -> fab.equals(lot.getFab()))
                    .collect(Collectors.toList());
        }
        
        return allLots;
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
        List<LotData> allLots = getMockLotData();
        
        return allLots.stream()
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