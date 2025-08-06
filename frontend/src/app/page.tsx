'use client';

import { useState } from 'react';
import { Bot, Factory, BarChart3, Settings, Zap } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'AI 기반 분석',
      description: 'LangChain과 OpenAI를 활용한 지능형 데이터 분석 및 의사결정 지원'
    },
    {
      icon: <Factory className="w-8 h-8 text-green-600" />,
      title: 'Lot 추적 관리',
      description: '실시간 Lot 상태 모니터링 및 이력 관리로 생산 효율성 극대화'
    },
    {
      icon: <Settings className="w-8 h-8 text-purple-600" />,
      title: '설비 모니터링',
      description: '설비 상태 실시간 감시 및 예측 정비를 통한 가동률 향상'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: '반송 관리',
      description: '반송 이력 추적 및 분석을 통한 품질 개선'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Zap className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            AI MES System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            인공지능 기반 제조 실행 시스템으로 스마트 팩토리를 구현하세요
          </p>
          <button 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            onClick={() => window.location.href = '/dashboard'}
          >
            시스템 시작하기
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              주요 기능
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI 기술과 제조 실행 시스템의 완벽한 결합
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-lg text-gray-700">팹 연동</div>
              <div className="text-sm text-gray-500">M14, M15, M16</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-lg text-gray-700">실시간 모니터링</div>
              <div className="text-sm text-gray-500">무중단 서비스</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">AI</div>
              <div className="text-lg text-gray-700">지능형 분석</div>
              <div className="text-sm text-gray-500">OpenAI 기반</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}