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
  context?: any; // 화면의 데이터를 컨텍스트로 전달
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

export default function AIChatPanel({ isOpen, onClose, agentType, context }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Focus trap within the panel when open
  useEffect(() => {
    if (!isOpen) return;
    const root = panelRef.current;
    if (!root) return;
    const focusable = root.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener('keydown', onKeyDown);
    return () => root.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // 실제 AI API 호출 (임시로 시뮬레이션 포함)
  const callAIAnalysis = async (userMessage: string) => {
    try {
      const { aiAnalysisApi } = await import('@/api');
      const response = await aiAnalysisApi.chatAnalysis(userMessage, agentType, context);
      
      if (response.success && response.data) {
        return response.data.analysis;
      } else {
        throw new Error(response.message || 'AI 분석 실패');
      }
    } catch (error: any) {
      console.error('AI 분석 호출 실패:', error);
      
      // AI 서비스가 실행되지 않은 경우 컨텍스트 기반 시뮬레이션 응답
      if (error.message.includes('서버에 연결할 수 없습니다') || error.message.includes('서버 오류가 발생했습니다')) {
        return generateContextBasedResponse(userMessage);
      }
      
      return `죄송합니다. AI 분석 중 오류가 발생했습니다: ${error.message}`;
    }
  };

  // 컨텍스트 기반 시뮬레이션 응답 생성
  const generateContextBasedResponse = (userMessage: string): string => {
    if (!context) {
      return `AI 서비스에 연결할 수 없어 임시 응답을 제공합니다.\n\n질문: "${userMessage}"\n\n현재 AI 서비스가 실행되지 않고 있습니다. 서비스를 시작한 후 다시 시도해주세요.`;
    }

    const { pageType, totalCount } = context;
    let response = `AI 서비스에 연결할 수 없어 컨텍스트 기반 임시 응답을 제공합니다.\n\n질문: "${userMessage}"\n\n`;

    if (pageType === 'lot_history' && context.lotData) {
      const lotData = context.lotData;
      const fabs = Array.from(new Set(lotData.map((lot: any) => lot.fab)));
      const statuses = Array.from(new Set(lotData.map((lot: any) => lot.status)));
      
      response += `📊 현재 Lot History 화면 분석:\n`;
      response += `- 총 Lot 수: ${totalCount}개\n`;
      response += `- 팹: ${fabs.join(', ')}\n`;
      response += `- 상태: ${statuses.join(', ')}\n`;
      
      if (context.searchTerm) {
        response += `- 검색어: ${context.searchTerm}\n`;
      }
      
      response += `\n💡 주요 인사이트:\n`;
      response += `- 검색된 Lot들의 상태 분포를 확인하세요\n`;
      response += `- 특정 팹에서 문제가 집중되는지 검토가 필요합니다\n`;
      response += `- 완전한 분석을 위해 AI 서비스를 시작해주세요\n`;
      
    } else if (pageType === 'equipment_history' && context.equipmentData) {
      const equipmentData = context.equipmentData;
      const fabs = Array.from(new Set(equipmentData.map((eq: any) => eq.fab)));
      const statuses = Array.from(new Set(equipmentData.map((eq: any) => eq.status)));
      
      response += `🔧 현재 Equipment History 화면 분석:\n`;
      response += `- 총 설비 수: ${totalCount}개\n`;
      response += `- 팹: ${fabs.join(', ')}\n`;
      response += `- 상태: ${statuses.join(', ')}\n`;
      
      response += `\n💡 주요 인사이트:\n`;
      response += `- 설비별 가동률과 성능을 점검하세요\n`;
      response += `- 정비가 필요한 설비가 있는지 확인이 필요합니다\n`;
      response += `- 상세한 분석을 위해 AI 서비스를 시작해주세요\n`;
      
    } else if (pageType === 'return_history' && context.returnData) {
      const returnData = context.returnData;
      const summaryStats = context.summaryStats;
      
      response += `🔄 현재 반송 이력 화면 분석:\n`;
      response += `- 총 반송 건수: ${summaryStats?.totalReturns || totalCount}개\n`;
      response += `- 해결완료: ${summaryStats?.resolvedCount || 0}개\n`;
      response += `- 처리중: ${summaryStats?.inProgressCount || 0}개\n`;
      response += `- High 심각도: ${summaryStats?.highSeverityCount || 0}개\n`;
      
      response += `\n💡 주요 인사이트:\n`;
      response += `- 반송률 개선이 필요한 영역을 식별하세요\n`;
      response += `- High 심각도 반송의 근본 원인 분석이 중요합니다\n`;
      response += `- 완전한 패턴 분석을 위해 AI 서비스를 시작해주세요\n`;
    }
    
    response += `\n⚠️ AI 서비스 시작 방법:\n`;
    response += `1. 터미널에서 ai-service 폴더로 이동\n`;
    response += `2. 'python -m uvicorn app.main:app --reload' 실행\n`;
    response += `3. AI 서비스가 시작되면 더 정확한 분석을 받을 수 있습니다`;
    
    return response;
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

    const aiResponse = await callAIAnalysis(userMessage.content);
    
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
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end backdrop-blur-sm">
      <div ref={panelRef} className="w-full max-w-md h-full bg-white/95 backdrop-blur shadow-2xl flex flex-col border-l border-slate-200" role="dialog" aria-modal="true" aria-label="AI 대화 패널">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/70">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-2 rounded-lg shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{config.title}</h3>
              <p className="text-sm text-slate-500">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">AI와 대화를 시작해보세요</p>
              <div className="space-y-2">
                {config.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left p-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
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
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
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
              <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-xl">
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
        <div className="p-4 border-t border-slate-200/70">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={config.placeholder}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors focus-ring"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 