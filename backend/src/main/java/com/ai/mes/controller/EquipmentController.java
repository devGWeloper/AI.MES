package com.ai.mes.controller;

import com.ai.mes.dto.ApiResponse;
import com.ai.mes.model.EquipmentData;
import com.ai.mes.service.EquipmentService;
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
@RequestMapping("/equipment")
@RequiredArgsConstructor
@Tag(name = "Equipment Management", description = "설비 관리 API")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/history")
    @Operation(summary = "설비 이력 조회", description = "팹별 설비 작업 이력을 조회합니다.")
    public ResponseEntity<ApiResponse<List<EquipmentData>>> getEquipmentHistory(
            @Parameter(description = "팹 코드 (M14, M15, M16)") @RequestParam(required = false) String fab) {
        try {
            List<EquipmentData> equipmentHistory = equipmentService.getEquipmentHistory(fab);
            return ResponseEntity.ok(ApiResponse.success(equipmentHistory, "설비 이력 조회 성공"));
        } catch (Exception e) {
            log.error("Error getting equipment history", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 이력 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/status")
    @Operation(summary = "설비 상태 조회", description = "실시간 설비 상태를 조회합니다.")
    public ResponseEntity<ApiResponse<List<EquipmentData>>> getEquipmentStatus(
            @Parameter(description = "팹 코드 (M14, M15, M16)") @RequestParam(required = false) String fab) {
        try {
            List<EquipmentData> equipmentStatus = equipmentService.getEquipmentStatus(fab);
            return ResponseEntity.ok(ApiResponse.success(equipmentStatus, "설비 상태 조회 성공"));
        } catch (Exception e) {
            log.error("Error getting equipment status", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 상태 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/{equipmentId}")
    @Operation(summary = "특정 설비 상세 조회", description = "특정 설비의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<EquipmentData>> getEquipmentDetails(
            @Parameter(description = "설비 ID") @PathVariable String equipmentId) {
        try {
            EquipmentData equipmentData = equipmentService.getEquipmentDetails(equipmentId);
            if (equipmentData != null) {
                return ResponseEntity.ok(ApiResponse.success(equipmentData, "설비 상세정보 조회 성공"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error getting equipment details for equipmentId: {}", equipmentId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 상세정보 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "설비 검색", description = "조건에 따라 설비를 검색합니다.")
    public ResponseEntity<ApiResponse<List<EquipmentData>>> searchEquipment(
            @Parameter(description = "검색어") @RequestParam(required = false) String keyword,
            @Parameter(description = "팹 코드") @RequestParam(required = false) String fab,
            @Parameter(description = "상태") @RequestParam(required = false) String status) {
        try {
            List<EquipmentData> equipment = equipmentService.searchEquipment(keyword, fab, status);
            return ResponseEntity.ok(ApiResponse.success(equipment, "설비 검색 성공"));
        } catch (Exception e) {
            log.error("Error searching equipment", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PutMapping("/{equipmentId}/status")
    @Operation(summary = "설비 상태 업데이트", description = "설비 상태를 업데이트합니다.")
    public ResponseEntity<ApiResponse<EquipmentData>> updateEquipmentStatus(
            @Parameter(description = "설비 ID") @PathVariable String equipmentId,
            @Parameter(description = "상태") @RequestParam String status) {
        try {
            EquipmentData updatedEquipment = equipmentService.updateEquipmentStatus(equipmentId, status);
            return ResponseEntity.ok(ApiResponse.success(updatedEquipment, "설비 상태 업데이트 성공"));
        } catch (Exception e) {
            log.error("Error updating equipment status for equipmentId: {}", equipmentId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}