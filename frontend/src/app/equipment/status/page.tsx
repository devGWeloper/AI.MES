'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity, Bot, AlertTriangle, Settings, Clock, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';

interface EquipmentStatus {
  id: string;
  equipmentId: string;
  equipmentName: string;
  fab: string;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  currentOperation?: string;
  currentLot?: string;
  utilization: number;
  lastMaintenance: string;
  nextMaintenance: string;
  temperature?: number;
  pressure?: number;
  uptime: string;
  alerts: number;
}

export default function EquipmentStatusPage() {
  const [equipmentStatuses, setEquipmentStatuses] = useState<EquipmentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedFab, setSelectedFab] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Mock real-time data
  useEffect(() => {
    const mockData: EquipmentStatus[] = [
      {
        id: '1',
        equipmentId: 'LITHO-001',
        equipmentName: 'Lithography Scanner A',
        fab: 'M14',
        status: 'running',
        currentOperation: 'Exposure',
        currentLot: 'LOT001',
        utilization: 85,
        lastMaintenance: '2024-07-15',
        nextMaintenance: '2024-08-15',
        temperature: 23.5,
        pressure: 1.2,
        uptime: '72시간 15분',
        alerts: 0
      },
      {
        id: '2',
        equipmentId: 'ETCH-002',
        equipmentName: 'Etching System B',
        fab: 'M15',
        status: 'maintenance',
        currentOperation: 'Dry Etch',
        currentLot: 'LOT002',
        utilization: 45,
        lastMaintenance: '2024-07-20',
        nextMaintenance: '2024-08-05',
        temperature: 25.1,
        pressure: 0.8,
        uptime: '48시간 30분',
        alerts: 2
      },
      {
        id: '3',
        equipmentId: 'DEP-003',
        equipmentName: 'Deposition Chamber C',
        fab: 'M16',
        status: 'error',
        currentOperation: 'CVD',
        currentLot: 'LOT003',
        utilization: 12,
        lastMaintenance: '2024-07-10',
        nextMaintenance: '2024-08-02',
        temperature: 28.3,
        pressure: 1.5,
        uptime: '24시간 45분',
        alerts: 3
      },
      {
        id: '4',
        equipmentId: 'CMP-001',
        equipmentName: 'CMP Polisher A',
        fab: 'M14',
        status: 'idle',
        currentOperation: 'Chemical Polishing',
        currentLot: undefined,
        utilization: 0,
        lastMaintenance: '2024-07-25',
        nextMaintenance: '2024-08-10',
        temperature: 22.0,
        pressure: 1.0,
        uptime: '0시간 0분',
        alerts: 1
      }
    ];
    setEquipmentStatuses(mockData);
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
      case 'running': return <Activity className="w-5 h-5 text-green-600" />;
      case 'idle': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'maintenance': return <Settings className="w-5 h-5 text-blue-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'border-green-200 bg-green-50';
      case 'idle': return 'border-yellow-200 bg-yellow-50';
      case 'maintenance': return 'border-blue-200 bg-blue-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '가동 중';
      case 'idle': return '유휴';
      case 'maintenance': return '정비 중';
      case 'error': return '오류';
      default: return '알 수 없음';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-green-600';
    if (utilization >= 60) return 'bg-yellow-600';
    if (utilization >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const filteredData = equipmentStatuses.filter(equipment => {
    return selectedFab === 'all' || equipment.fab === selectedFab;
  });

  const totalAlerts = equipmentStatuses.reduce((sum, eq) => sum + eq.alerts, 0);
  const avgUtilization = equipmentStatuses.reduce((sum, eq) => sum + eq.utilization, 0) / equipmentStatuses.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment Status</h1>
            <p className="text-gray-600 mt-2">실시간 설비 상태 모니터링</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFab}
              onChange={(e) => setSelectedFab(e.target.value)}
            >
              <option value="all">전체 팹</option>
              <option value="M14">M14</option>
              <option value="M15">M15</option>
              <option value="M16">M16</option>
            </select>
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

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">총 설비</h3>
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{filteredData.length}</div>
            <p className="text-sm text-gray-600 mt-2">마지막 업데이트: {lastRefresh.toLocaleTimeString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">가동 중</h3>
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {filteredData.filter(eq => eq.status === 'running').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">정상 가동 중</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">평균 가동률</h3>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{avgUtilization.toFixed(1)}%</div>
            <p className="text-sm text-gray-600 mt-2">전체 설비 평균</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">알람</h3>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{totalAlerts}</div>
            <p className="text-sm text-gray-600 mt-2">확인 필요</p>
          </div>
        </div>

        {/* Equipment Status Cards */}
        <div className="space-y-4">
          {filteredData.map((equipment) => (
            <div
              key={equipment.id}
              className={`bg-white rounded-lg shadow border-l-4 ${getStatusColor(equipment.status)} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(equipment.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{equipment.equipmentId}</h3>
                    <p className="text-sm text-gray-600">{equipment.equipmentName} | {equipment.fab}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{equipment.utilization}%</div>
                  <div className="text-sm text-gray-600">가동률</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">상태</div>
                  <div className="font-semibold text-gray-900">{getStatusText(equipment.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">현재 작업</div>
                  <div className="font-semibold text-gray-900">{equipment.currentOperation || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">처리 중 LOT</div>
                  <div className="font-semibold text-gray-900">{equipment.currentLot || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">연속 가동시간</div>
                  <div className="font-semibold text-gray-900">{equipment.uptime}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>가동률</span>
                  <span>{equipment.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(equipment.utilization)}`}
                    style={{ width: `${equipment.utilization}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">온도</div>
                  <div className="font-semibold">{equipment.temperature}°C</div>
                </div>
                <div>
                  <div className="text-gray-600">압력</div>
                  <div className="font-semibold">{equipment.pressure} bar</div>
                </div>
                <div>
                  <div className="text-gray-600">알람</div>
                  <div className={`font-semibold ${equipment.alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {equipment.alerts}개
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                <span>마지막 정비: {equipment.lastMaintenance}</span>
                <span>다음 정비: {equipment.nextMaintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        agentType="equipment"
      />
    </div>
  );
}