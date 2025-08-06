'use client';

import { useState } from 'react';
import { Bot, Factory, BarChart3, Settings, Zap, Package, Truck, Activity, History } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const dashboardCards = [
    {
      icon: <Package className="w-8 h-8 text-blue-600" />,
      title: 'Lot 관리',
      description: 'Lot 상태 및 이력 관리',
      path: '/lot/history',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: <Settings className="w-8 h-8 text-green-600" />,
      title: '설비 관리',
      description: '설비 상태 및 이력 관리',
      path: '/equipment/history',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      title: '반송 관리',
      description: '반송 이력 조회 및 분석',
      path: '/return/history',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      icon: <Bot className="w-8 h-8 text-orange-600" />,
      title: 'AI 분석',
      description: 'AI 기반 데이터 분석',
      onClick: () => setIsAIChatOpen(true),
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  const quickStats = [
    {
      title: '활성 Lot',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: <Package className="w-5 h-5" />
    },
    {
      title: '설비 가동률',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: '반송률',
      value: '2.3%',
      change: '-0.5%',
      changeType: 'negative',
      icon: <Truck className="w-5 h-5" />
    },
    {
      title: 'AI 분석 완료',
      value: '89',
      change: '+15',
      changeType: 'positive',
      icon: <Bot className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI MES 대시보드</h1>
          <p className="text-gray-600">제조 실행 시스템 현황을 한눈에 확인하세요</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs 지난주</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <div 
              key={index}
              className={`${card.color} rounded-xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md`}
              onClick={() => {
                if (card.onClick) {
                  card.onClick();
                } else if (card.path) {
                  window.location.href = card.path;
                }
              }}
            >
              <div className="mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lot M14-2024-001 상태 변경</p>
                <p className="text-xs text-gray-500">2분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <Settings className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">설비 EQP-001 정비 완료</p>
                <p className="text-xs text-gray-500">15분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">반송 이력 업데이트</p>
                <p className="text-xs text-gray-500">1시간 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        agentType="general"
      />
    </div>
  );
} 