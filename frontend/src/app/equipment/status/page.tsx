'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Settings, Bot, AlertTriangle, Activity, Clock } from 'lucide-react';

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
  const [aiInsights, setAiInsights] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [selectedFab, setSelectedFab] = useState('all');

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
        lastMaintenance: '2024-07-25',
        nextMaintenance: '2024-08-10',
        temperature: 23.5,
        pressure: 1.2,
        uptime: '168시간',
        alerts: 0
      },
      {
        id: '2',
        equipmentId: 'ETCH-002',
        equipmentName: 'Etching System B',
        fab: 'M15',
        status: 'error',
        currentOperation: 'Maintenance',
        utilization: 45,
        lastMaintenance: '2024-07-20',
        nextMaintenance: '2024-08-05',
        temperature: 25.8,
        pressure: 0.9,
        uptime: '72시간',
        alerts: 3
      },
      {
        id: '3',
        equipmentId: 'DEP-003',
        equipmentName: 'Deposition Chamber C',
        fab: 'M16',
        status: 'maintenance',
        currentOperation: 'Scheduled PM',
        utilization: 0,
        lastMaintenance: '2024-08-01',
        nextMaintenance: '2024-08-15',
        temperature: 22.1,
        pressure: 1.0,
        uptime: '0시간',
        alerts: 0
      },
      {
        id: '4',
        equipmentId: 'CMP-001',
        equipmentName: 'CMP Polisher A',
        fab: 'M14',
        status: 'idle',
        utilization: 65,
        lastMaintenance: '2024-07-28',
        nextMaintenance: '2024-08-12',
        temperature: 24.2,
        pressure: 1.1,
        uptime: '120시간',
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

  const handleAiInsights = async () => {
    setShowAiPanel(true);
    setLoading(true);
    
    setTimeout(() => {
      setAiInsights(`
🤖 설비 상태 AI 분석:

📊 전체 설비 현황:
- 총 ${equipmentStatuses.length}대 설비 모니터링 중
- 가동 중: ${equipmentStatuses.filter(eq => eq.status === 'running').length}대
- 유휴: ${equipmentStatuses.filter(eq => eq.status === 'idle').length}대
- 정비 중: ${equipmentStatuses.filter(eq => eq.status === 'maintenance').length}대
- 오류: ${equipmentStatuses.filter(eq => eq.status === 'error').length}대

⚡ 가동률 분석:
- 평균 가동률: 48.75%
- 최고 가동률: LITHO-001 (85%)
- 개선 필요: ETCH-002 (45%)

🚨 긴급 조치 필요:
1. ETCH-002 (M15): 시스템 오류 발생
   - 3개 알람 활성화
   - 가스 압력 이상 (0.9 bar)
   - 즉시 엔지니어 파견 필요

⚠️ 주의 사항:
1. CMP-001: 1개 알람 - 소모품 교체 시기 임박
2. 전체 평균 가동률 저조 - 스케줄링 최적화 필요

💡 효율성 개선 제안:
- LITHO-001 높은 가동률 → 추가 LOT 투입 가능
- CMP-001 유휴 상태 → 대기 LOT 배정 검토
- 예방 정비 스케줄 조정으로 가동률 10% 향상 가능

🔧 정비 계획:
- DEP-003: 정기 정비 완료 예정 (8/2)
- ETCH-002: 긴급 정비 후 8/5 정기 정비 앞당김 권장
      `);
      setLoading(false);
    }, 2000);
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
            onClick={handleAiInsights}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bot className="w-5 h-5" />
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Equipment Status Cards */}
        <div className="lg:col-span-2 space-y-4">
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

        {/* AI Insights Panel */}
        {showAiPanel && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI 분석</h3>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {aiInsights}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}