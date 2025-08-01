package com.ai.mes.controller;

import com.ai.mes.dto.ApiResponse;
import com.ai.mes.model.LotData;
import com.ai.mes.service.LotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/lots")
@RequiredArgsConstructor
@Tag(name = "Lot Management", description = "Lot 관리 API")
public class LotController {

    private final LotService lotService;

    @GetMapping("/history")
    @Operation(summary = "Lot 이력 조회", description = "팹별 Lot 이력을 조회합니다.")
    public ResponseEntity<ApiResponse<List<LotData>>> getLotHistory(
            @Parameter(description = "팹 코드 (M14, M15, M16)") @RequestParam(required = false) String fab) {
        try {
            List<LotData> lotHistory = lotService.getLotHistory(fab);
            return ResponseEntity.ok(ApiResponse.success(lotHistory, "Lot 이력 조회 성공"));
        } catch (Exception e) {
            log.error("Error getting lot history", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lot 이력 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/status")
    @Operation(summary = "Lot 상태 조회", description = "실시간 Lot 상태를 조회합니다.")
    public ResponseEntity<ApiResponse<List<LotData>>> getLotStatus(
            @Parameter(description = "팹 코드 (M14, M15, M16)") @RequestParam(required = false) String fab) {
        try {
            List<LotData> lotStatus = lotService.getLotStatus(fab);
            return ResponseEntity.ok(ApiResponse.success(lotStatus, "Lot 상태 조회 성공"));
        } catch (Exception e) {
            log.error("Error getting lot status", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lot 상태 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/{lotNumber}")
    @Operation(summary = "특정 Lot 상세 조회", description = "특정 Lot의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<LotData>> getLotDetails(
            @Parameter(description = "Lot 번호") @PathVariable String lotNumber) {
        try {
            LotData lotData = lotService.getLotDetails(lotNumber);
            if (lotData != null) {
                return ResponseEntity.ok(ApiResponse.success(lotData, "Lot 상세정보 조회 성공"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error getting lot details for lotNumber: {}", lotNumber, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lot 상세정보 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Lot 검색", description = "조건에 따라 Lot을 검색합니다.")
    public ResponseEntity<ApiResponse<List<LotData>>> searchLots(
            @Parameter(description = "검색어") @RequestParam(required = false) String keyword,
            @Parameter(description = "팹 코드") @RequestParam(required = false) String fab,
            @Parameter(description = "상태") @RequestParam(required = false) String status) {
        try {
            List<LotData> lots = lotService.searchLots(keyword, fab, status);
            return ResponseEntity.ok(ApiResponse.success(lots, "Lot 검색 성공"));
        } catch (Exception e) {
            log.error("Error searching lots", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lot 검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}