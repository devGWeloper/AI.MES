'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agentType: 'lot' | 'equipment' | 'return' | 'general';
}

const agentConfigs = {
  lot: {
    title: 'Lot AI 분석',
    description: 'Lot 데이터에 대한 질문을 해보세요',
    placeholder: '예: Lot M14-2024-001의 생산 이력을 분석해줘',
    suggestions: [
      'Lot M14-2024-001의 생산 이력을 분석해줘',
      '최근 반송률이 높은 Lot은 무엇인가요?',
      'Lot별 생산성 비교 분석을 해줘'
    ]
  },
  equipment: {
    title: '설비 AI 분석',
    description: '설비 데이터에 대한 질문을 해보세요',
    placeholder: '예: 설비 EQP-001의 가동률을 분석해줘',
    suggestions: [
      '설비 EQP-001의 가동률을 분석해줘',
      '정비가 필요한 설비는 무엇인가요?',
      '설비별 성능 비교 분석을 해줘'
    ]
  },
  return: {
    title: '반송 AI 분석',
    description: '반송 데이터에 대한 질문을 해보세요',
    placeholder: '예: 반송률이 높은 원인을 분석해줘',
    suggestions: [
      '반송률이 높은 원인을 분석해줘',
      '반송 패턴을 분석해줘',
      '반송 예방 방안을 제시해줘'
    ]
  },
  general: {
    title: 'AI 분석',
    description: '전체 시스템에 대한 질문을 해보세요',
    placeholder: '예: 전체 생산성 개선 방안을 제시해줘',
    suggestions: [
      '전체 생산성 개선 방안을 제시해줘',
      '시스템 전반의 문제점을 분석해줘',
      '최적화 방안을 제안해줘'
    ]
  }
};

export default function AIChatPanel({ isOpen, onClose, agentType }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = agentConfigs[agentType];

  // 메시지 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 패널이 열릴 때 입력창에 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // AI 응답 시뮬레이션
  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // 실제 API 호출을 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let aiResponse = '';
    
    switch (agentType) {
      case 'lot':
        if (userMessage.includes('생산 이력')) {
          aiResponse = 'Lot M14-2024-001의 생산 이력을 분석한 결과:\n\n• 생산 시작: 2024-01-15 09:00\n• 완료 시간: 2024-01-16 14:30\n• 총 생산 시간: 29.5시간\n• 생산량: 1,200개\n• 불량률: 0.8%\n• 반송 횟수: 2회\n\n전반적으로 양호한 생산성을 보이고 있으며, 불량률이 업계 평균(1.2%)보다 낮습니다.';
        } else if (userMessage.includes('반송률')) {
          aiResponse = '최근 반송률이 높은 Lot 분석:\n\n1. Lot M16-2024-005 (반송률: 15.2%)\n   - 원인: 설비 불량으로 인한 품질 이슈\n   - 조치: 설비 정비 완료\n\n2. Lot M15-2024-012 (반송률: 12.8%)\n   - 원인: 원자재 품질 문제\n   - 조치: 공급업체 교체 검토\n\n3. Lot M14-2024-008 (반송률: 8.5%)\n   - 원인: 작업자 실수\n   - 조치: 교육 강화';
        } else {
          aiResponse = 'Lot 데이터를 분석한 결과를 제공해드리겠습니다. 더 구체적인 질문을 해주시면 더 정확한 분석을 제공할 수 있습니다.';
        }
        break;
        
      case 'equipment':
        if (userMessage.includes('가동률')) {
          aiResponse = '설비 EQP-001 가동률 분석:\n\n• 현재 가동률: 94.2%\n• 목표 가동률: 95.0%\n• 월간 평균: 93.8%\n• 정비 시간: 2.5시간/일\n• 다운타임: 1.2시간/일\n\n개선 방안:\n1. 예방 정비 스케줄 최적화\n2. 정비 시간 단축을 위한 툴 개선\n3. 작업자 교육 강화';
        } else if (userMessage.includes('정비')) {
          aiResponse = '정비가 필요한 설비 목록:\n\n🔴 긴급 정비 필요:\n• EQP-003: 베어링 마모 (2일 내 정비 필요)\n• EQP-007: 모터 이상 소음 (즉시 정비 필요)\n\n🟡 예방 정비 권장:\n• EQP-001: 다음 주 정비 예정\n• EQP-005: 3일 후 정비 권장\n\n🟢 정상 상태:\n• EQP-002, EQP-004, EQP-006';
        } else {
          aiResponse = '설비 데이터를 분석한 결과를 제공해드리겠습니다. 특정 설비나 지표에 대해 더 자세히 알고 싶으시면 말씀해 주세요.';
        }
        break;
        
      case 'return':
        if (userMessage.includes('반송률') && userMessage.includes('원인')) {
          aiResponse = '반송률이 높은 주요 원인 분석:\n\n📊 반송률 현황: 2.3% (목표: 1.5% 이하)\n\n🔍 주요 원인:\n1. 설비 불량 (45%)\n   - 베어링 마모\n   - 정밀도 저하\n\n2. 원자재 품질 (30%)\n   - 공급업체 품질 불안정\n   - 검수 기준 강화 필요\n\n3. 작업자 실수 (15%)\n   - 교육 부족\n   - 표준 작업 절차 미준수\n\n4. 기타 (10%)\n   - 환경 요인\n   - 측정 오차\n\n💡 개선 방안:\n• 예방 정비 강화\n• 공급업체 품질 관리\n• 작업자 교육 프로그램 개선';
        } else if (userMessage.includes('패턴')) {
          aiResponse = '반송 패턴 분석 결과:\n\n📈 시간대별 패턴:\n• 오전 9-11시: 반송률 3.2% (피크)\n• 오후 2-4시: 반송률 1.8%\n• 야간: 반송률 1.5%\n\n📅 요일별 패턴:\n• 월요일: 반송률 2.8% (가장 높음)\n• 금요일: 반송률 1.9%\n• 주말: 반송률 1.2%\n\n🏭 설비별 패턴:\n• EQP-003: 반송률 4.1% (가장 높음)\n• EQP-001: 반송률 1.2% (가장 낮음)\n\n💡 인사이트:\n• 월요일 오전 정비 후 첫 생산에서 반송률 증가\n• EQP-003 정비 필요성 확인';
        } else {
          aiResponse = '반송 데이터를 분석한 결과를 제공해드리겠습니다. 반송률, 패턴, 원인 등에 대해 더 구체적으로 질문해 주시면 상세한 분석을 제공할 수 있습니다.';
        }
        break;
        
      default:
        aiResponse = '전체 시스템을 분석한 결과를 제공해드리겠습니다. 특정 영역이나 지표에 대해 더 자세히 알고 싶으시면 말씀해 주세요.';
    }
    
    setIsLoading(false);
    return aiResponse;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const aiResponse = await simulateAIResponse(userMessage.content);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">AI와 대화를 시작해보세요</p>
              <div className="space-y-2">
                {config.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI가 분석 중입니다...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={config.placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 