'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity, Bot, AlertTriangle, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';

interface LotStatus {
  id: string;
  lotNumber: string;
  product: string;
  fab: string;
  currentStep: string;
  equipment: string;
  progress: number;
  estimatedCompletion: string;
  status: 'normal' | 'warning' | 'error';
  lastUpdate: string;
}

export default function LotStatusPage() {
  const [lotStatuses, setLotStatuses] = useState<LotStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Mock real-time data
  useEffect(() => {
    const mockData: LotStatus[] = [
      {
        id: '1',
        lotNumber: 'LOT001',
        product: 'Product A',
        fab: 'M14',
        currentStep: 'Lithography',
        equipment: 'LITHO-001',
        progress: 85,
        estimatedCompletion: '2024-08-01 16:30',
        status: 'normal',
        lastUpdate: '2024-08-01 14:25:00'
      },
      {
        id: '2',
        lotNumber: 'LOT002',
        product: 'Product B',
        fab: 'M15',
        currentStep: 'Etching',
        equipment: 'ETCH-002',
        progress: 45,
        estimatedCompletion: '2024-08-01 18:00',
        status: 'warning',
        lastUpdate: '2024-08-01 14:20:00'
      },
      {
        id: '3',
        lotNumber: 'LOT003',
        product: 'Product C',
        fab: 'M16',
        currentStep: 'Deposition',
        equipment: 'DEP-003',
        progress: 12,
        estimatedCompletion: '2024-08-02 09:15',
        status: 'error',
        lastUpdate: '2024-08-01 14:15:00'
      }
    ];
    setLotStatuses(mockData);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <Activity className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'error') return 'bg-red-600';
    if (status === 'warning') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lot Status</h1>
            <p className="text-gray-600 mt-2">실시간 Lot 상태 모니터링</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>AI 분석</span>
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">총 Lot 수</h3>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{lotStatuses.length}</div>
            <p className="text-sm text-gray-600 mt-2">마지막 업데이트: {lastRefresh.toLocaleTimeString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">정상 진행</h3>
              <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {lotStatuses.filter(lot => lot.status === 'normal').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">평균 진행률: 85%</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">주의/오류</h3>
              <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {lotStatuses.filter(lot => lot.status !== 'normal').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">즉시 확인 필요</p>
          </div>
        </div>

        {/* Lot Status List */}
        <div className="space-y-4">
          {lotStatuses.map((lot) => (
            <div
              key={lot.id}
              className={`bg-white rounded-lg shadow border-l-4 ${getStatusColor(lot.status)} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(lot.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lot.lotNumber}</h3>
                    <p className="text-sm text-gray-600">{lot.product} | {lot.fab}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{lot.progress}%</div>
                  <div className="text-sm text-gray-600">진행률</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>현재 공정: {lot.currentStep}</span>
                  <span>설비: {lot.equipment}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(lot.progress, lot.status)}`}
                    style={{ width: `${lot.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>예상 완료: {lot.estimatedCompletion}</span>
                <span>마지막 업데이트: {lot.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        agentType="lot"
      />
    </div>
  );
}