package com.ai.mes.service;

import com.ai.mes.dto.AIAnalysisRequest;
import com.ai.mes.dto.AIAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final WebClient webClient;
    
    @Value("${ai-service.base-url}")
    private String aiServiceBaseUrl;
    
    @Value("${ai-service.timeout}")
    private int timeout;

    public AIAnalysisResponse analyzeLotData(AIAnalysisRequest request) {
        log.info("Analyzing lot data with AI service for type: {}", request.getType());
        
        try {
            // Call AI service
            Mono<AIAnalysisResponse> responseMono = webClient
                    .post()
                    .uri(aiServiceBaseUrl + "/api/analyze/lot")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AIAnalysisResponse.class)
                    .timeout(java.time.Duration.ofMillis(timeout));
            
            return responseMono.block();
            
        } catch (Exception e) {
            log.error("Error calling AI service for lot analysis", e);
            // Return mock response for development
            return createMockLotAnalysisResponse();
        }
    }

    public AIAnalysisResponse analyzeEquipmentData(AIAnalysisRequest request) {
        log.info("Analyzing equipment data with AI service for type: {}", request.getType());
        
        try {
            // Call AI service
            Mono<AIAnalysisResponse> responseMono = webClient
                    .post()
                    .uri(aiServiceBaseUrl + "/api/analyze/equipment")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AIAnalysisResponse.class)
                    .timeout(java.time.Duration.ofMillis(timeout));
            
            return responseMono.block();
            
        } catch (Exception e) {
            log.error("Error calling AI service for equipment analysis", e);
            // Return mock response for development
            return createMockEquipmentAnalysisResponse();
        }
    }

    public AIAnalysisResponse analyzeReturnData(AIAnalysisRequest request) {
        log.info("Analyzing return data with AI service for type: {}", request.getType());
        
        try {
            // Call AI service
            Mono<AIAnalysisResponse> responseMono = webClient
                    .post()
                    .uri(aiServiceBaseUrl + "/api/analyze/return")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AIAnalysisResponse.class)
                    .timeout(java.time.Duration.ofMillis(timeout));
            
            return responseMono.block();
            
        } catch (Exception e) {
            log.error("Error calling AI service for return analysis", e);
            // Return mock response for development
            return createMockReturnAnalysisResponse();
        }
    }

    public AIAnalysisResponse getStatusInsights(AIAnalysisRequest request) {
        log.info("Getting status insights from AI service for type: {}", request.getType());
        
        try {
            // Call AI service
            Mono<AIAnalysisResponse> responseMono = webClient
                    .post()
                    .uri(aiServiceBaseUrl + "/api/analyze/status")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AIAnalysisResponse.class)
                    .timeout(java.time.Duration.ofMillis(timeout));
            
            return responseMono.block();
            
        } catch (Exception e) {
            log.error("Error calling AI service for status insights", e);
            // Return mock response for development
            return createMockStatusInsightsResponse();
        }
    }

    // Mock responses for development
    private AIAnalysisResponse createMockLotAnalysisResponse() {
        List<String> recommendations = Arrays.asList(
                "LOT002의 진행 상황을 면밀히 모니터링",
                "EQP-002 설비 상태 점검 실시",
                "대기 중인 LOT003의 우선순위 조정 고려"
        );
        
        List<String> alerts = Arrays.asList(
                "LOT002가 예상보다 오래 걸리고 있음 (현재 Step 3에서 지연)",
                "EQP-002 설비 점검 필요 가능성"
        );
        
        return new AIAnalysisResponse(
                "🤖 AI 분석 결과: 현재 Lot 현황 분석 - 총 3개 Lot 중 완료: 1개, 진행중: 1개, 대기: 1개",
                recommendations,
                alerts,
                LocalDateTime.now()
        );
    }

    private AIAnalysisResponse createMockEquipmentAnalysisResponse() {
        List<String> recommendations = Arrays.asList(
                "LITHO-001 높은 가동률 → 추가 LOT 투입 가능",
                "CMP-001 유휴 상태 → 대기 LOT 배정 검토",
                "예방 정비 스케줄 조정으로 가동률 10% 향상 가능"
        );
        
        List<String> alerts = Arrays.asList(
                "ETCH-002 (M15): 시스템 오류 발생 - 3개 알람 활성화",
                "CMP-001: 1개 알람 - 소모품 교체 시기 임박"
        );
        
        return new AIAnalysisResponse(
                "🤖 설비 상태 AI 분석: 전체 설비 현황 - 가동 중: 1대, 유휴: 1대, 정비 중: 1대, 오류: 1대",
                recommendations,
                alerts,
                LocalDateTime.now()
        );
    }

    private AIAnalysisResponse createMockReturnAnalysisResponse() {
        List<String> recommendations = Arrays.asList(
                "Lithography 공정 SPC 관리 강화",
                "설비 청소 프로토콜 개선",
                "측정 장비 교정 주기 검토",
                "공정 파라미터 자동 제어 시스템 도입"
        );
        
        List<String> alerts = Arrays.asList(
                "M14 팹에서 반송률이 높음 - Product A 품질 관리 강화 필요",
                "설비 오염 문제 지속 - 정기 청소 주기 단축 검토"
        );
        
        return new AIAnalysisResponse(
                "🤖 반송 이력 AI 분석: 총 4건의 반송 발생, 해결완료: 2건, 처리중: 1건, 분석중: 1건",
                recommendations,
                alerts,
                LocalDateTime.now()
        );
    }

    private AIAnalysisResponse createMockStatusInsightsResponse() {
        List<String> recommendations = Arrays.asList(
                "실시간 모니터링 대시보드 최적화",
                "알람 우선순위 시스템 구축",
                "예측 정비 알고리즘 도입"
        );
        
        List<String> alerts = Arrays.asList(
                "전반적인 시스템 성능 양호",
                "일부 설비에서 주의 필요"
        );
        
        return new AIAnalysisResponse(
                "🤖 실시간 상태 인사이트: 전체 시스템 가동률 75%, 평균 처리 시간 6.5시간",
                recommendations,
                alerts,
                LocalDateTime.now()
        );
    }
}