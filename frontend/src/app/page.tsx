'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Factory, BarChart3, Settings, Zap } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-800 pointer-events-none" />
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl -z-10 pointer-events-none" />
        <div className="container mx-auto px-6 py-24 text-center text-white relative z-10">
          <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/10 px-3 py-1 text-sm backdrop-blur mb-6">
            <span className="opacity-90">AI로 진화하는 스마트 팩토리</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            AI MES System
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            인공지능 기반 제조 실행 시스템으로 스마트 팩토리를 구현하세요
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              className="btn-primary px-6 py-3 bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => router.push('/dashboard')}
            >
              시스템 시작하기
            </button>
            <a href="#features" className="inline-flex items-center justify-center rounded-lg px-6 py-3 border border-white/30 text-white/90 hover:bg-white/10 transition-colors focus-ring">
              더 알아보기
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              주요 기능
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI 기술과 제조 실행 시스템의 완벽한 결합
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-lg text-slate-700">팹 연동</div>
              <div className="text-sm text-slate-500">M14, M15, M16</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-1">24/7</div>
              <div className="text-lg text-slate-700">실시간 모니터링</div>
              <div className="text-sm text-slate-500">무중단 서비스</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-1">AI</div>
              <div className="text-lg text-slate-700">지능형 분석</div>
              <div className="text-sm text-slate-500">OpenAI 기반</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}