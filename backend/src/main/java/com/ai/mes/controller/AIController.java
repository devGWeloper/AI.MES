package com.ai.mes.controller;

import com.ai.mes.dto.AIAnalysisRequest;
import com.ai.mes.dto.AIAnalysisResponse;
import com.ai.mes.dto.ApiResponse;
import com.ai.mes.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Analysis", description = "AI 분석 API")
public class AIController {

    private final AIService aiService;

    @PostMapping("/analyze/lot")
    @Operation(summary = "Lot 데이터 AI 분석", description = "Lot 데이터를 AI로 분석합니다.")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> analyzeLotData(
            @RequestBody AIAnalysisRequest request) {
        try {
            AIAnalysisResponse response = aiService.analyzeLotData(request);
            return ResponseEntity.ok(ApiResponse.success(response, "Lot 데이터 AI 분석 완료"));
        } catch (Exception e) {
            log.error("Error analyzing lot data", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lot 데이터 AI 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/analyze/equipment")
    @Operation(summary = "설비 데이터 AI 분석", description = "설비 데이터를 AI로 분석합니다.")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> analyzeEquipmentData(
            @RequestBody AIAnalysisRequest request) {
        try {
            AIAnalysisResponse response = aiService.analyzeEquipmentData(request);
            return ResponseEntity.ok(ApiResponse.success(response, "설비 데이터 AI 분석 완료"));
        } catch (Exception e) {
            log.error("Error analyzing equipment data", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("설비 데이터 AI 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/analyze/return")
    @Operation(summary = "반송 데이터 AI 분석", description = "반송 데이터를 AI로 분석합니다.")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> analyzeReturnData(
            @RequestBody AIAnalysisRequest request) {
        try {
            AIAnalysisResponse response = aiService.analyzeReturnData(request);
            return ResponseEntity.ok(ApiResponse.success(response, "반송 데이터 AI 분석 완료"));
        } catch (Exception e) {
            log.error("Error analyzing return data", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("반송 데이터 AI 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/analyze/status")
    @Operation(summary = "상태 모니터링 AI 인사이트", description = "상태 모니터링 데이터에 대한 AI 인사이트를 제공합니다.")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> getStatusInsights(
            @RequestBody AIAnalysisRequest request) {
        try {
            AIAnalysisResponse response = aiService.getStatusInsights(request);
            return ResponseEntity.ok(ApiResponse.success(response, "상태 모니터링 AI 인사이트 생성 완료"));
        } catch (Exception e) {
            log.error("Error generating status insights", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("상태 모니터링 AI 인사이트 생성 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}