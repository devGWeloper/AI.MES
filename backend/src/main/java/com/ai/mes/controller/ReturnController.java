package com.ai.mes.controller;

import com.ai.mes.dto.ApiResponse;
import com.ai.mes.model.ReturnHistory;
import com.ai.mes.service.ReturnService;
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
@RequestMapping("/returns")
@RequiredArgsConstructor
@Tag(name = "Return Management", description = "반송 관리 API")
public class ReturnController {

    private final ReturnService returnService;

    @GetMapping("/history")
    @Operation(summary = "반송 이력 조회", description = "팹별 반송 이력을 조회합니다.")
    public ResponseEntity<ApiResponse<List<ReturnHistory>>> getReturnHistory(
            @Parameter(description = "팹 코드 (M14, M15, M16)") @RequestParam(required = false) String fab) {
        try {
            List<ReturnHistory> returnHistory = returnService.getReturnHistory(fab);
            return ResponseEntity.ok(ApiResponse.success(returnHistory, "반송 이력 조회 성공"));
        } catch (Exception e) {
            log.error("Error getting return history", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 이력 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "반송 등록", description = "새로운 반송을 등록합니다.")
    public ResponseEntity<ApiResponse<ReturnHistory>> createReturn(
            @RequestBody ReturnHistory returnHistory) {
        try {
            ReturnHistory createdReturn = returnService.createReturn(returnHistory);
            return ResponseEntity.ok(ApiResponse.success(createdReturn, "반송 등록 성공"));
        } catch (Exception e) {
            log.error("Error creating return", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PutMapping("/{returnId}/status")
    @Operation(summary = "반송 상태 업데이트", description = "반송 상태를 업데이트합니다.")
    public ResponseEntity<ApiResponse<ReturnHistory>> updateReturnStatus(
            @Parameter(description = "반송 ID") @PathVariable String returnId,
            @Parameter(description = "상태") @RequestParam String status) {
        try {
            ReturnHistory updatedReturn = returnService.updateReturnStatus(returnId, status);
            return ResponseEntity.ok(ApiResponse.success(updatedReturn, "반송 상태 업데이트 성공"));
        } catch (Exception e) {
            log.error("Error updating return status for returnId: {}", returnId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/{returnId}")
    @Operation(summary = "특정 반송 상세 조회", description = "특정 반송의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<ReturnHistory>> getReturnDetails(
            @Parameter(description = "반송 ID") @PathVariable String returnId) {
        try {
            ReturnHistory returnHistory = returnService.getReturnDetails(returnId);
            if (returnHistory != null) {
                return ResponseEntity.ok(ApiResponse.success(returnHistory, "반송 상세정보 조회 성공"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error getting return details for returnId: {}", returnId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 상세정보 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "반송 검색", description = "조건에 따라 반송을 검색합니다.")
    public ResponseEntity<ApiResponse<List<ReturnHistory>>> searchReturns(
            @Parameter(description = "검색어") @RequestParam(required = false) String keyword,
            @Parameter(description = "팹 코드") @RequestParam(required = false) String fab,
            @Parameter(description = "상태") @RequestParam(required = false) String status,
            @Parameter(description = "심각도") @RequestParam(required = false) String severity) {
        try {
            List<ReturnHistory> returns = returnService.searchReturns(keyword, fab, status, severity);
            return ResponseEntity.ok(ApiResponse.success(returns, "반송 검색 성공"));
        } catch (Exception e) {
            log.error("Error searching returns", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}