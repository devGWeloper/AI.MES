'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Bot, Settings } from 'lucide-react';

interface EquipmentHistory {
  id: string;
  equipmentId: string;
  equipmentName: string;
  fab: string;
  operation: string;
  startTime: string;
  endTime?: string;
  duration: string;
  status: string;
  lotNumber?: string;
  result: string;
}

export default function EquipmentHistoryPage() {
  const [equipmentData, setEquipmentData] = useState<EquipmentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFab, setSelectedFab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Mock data
  useEffect(() => {
    const mockData: EquipmentHistory[] = [
      {
        id: '1',
        equipmentId: 'LITHO-001',
        equipmentName: 'Lithography Scanner A',
        fab: 'M14',
        operation: 'Exposure',
        startTime: '2024-08-01 09:00:00',
        endTime: '2024-08-01 11:30:00',
        duration: '2시간 30분',
        status: '완료',
        lotNumber: 'LOT001',
        result: '정상'
      },
      {
        id: '2',
        equipmentId: 'ETCH-002',
        equipmentName: 'Etching System B',
        fab: 'M15',
        operation: 'Dry Etch',
        startTime: '2024-08-01 10:15:00',
        endTime: '2024-08-01 14:45:00',
        duration: '4시간 30분',
        status: '완료',
        lotNumber: 'LOT002',
        result: '지연'
      },
      {
        id: '3',
        equipmentId: 'DEP-003',
        equipmentName: 'Deposition Chamber C',
        fab: 'M16',
        operation: 'CVD',
        startTime: '2024-08-01 11:00:00',
        duration: '진행중',
        status: '진행중',
        lotNumber: 'LOT003',
        result: '오류'
      },
      {
        id: '4',
        equipmentId: 'CMP-001',
        equipmentName: 'CMP Polisher A',
        fab: 'M14',
        operation: 'Chemical Polishing',
        startTime: '2024-08-01 08:00:00',
        endTime: '2024-08-01 09:00:00',
        duration: '1시간',
        status: '완료',
        lotNumber: 'LOT004',
        result: '정상'
      }
    ];
    setEquipmentData(mockData);
  }, []);

  const handleAiAnalysis = async () => {
    setShowAiPanel(true);
    setLoading(true);
    
    setTimeout(() => {
      setAiAnalysis(`
🤖 설비 이력 AI 분석:

📊 설비 가동 현황:
- 총 ${equipmentData.length}건의 작업 이력
- 완료: ${equipmentData.filter(eq => eq.status === '완료').length}건
- 진행중: ${equipmentData.filter(eq => eq.status === '진행중').length}건

⏱️ 작업 시간 분석:
- 평균 작업 시간: 2.5시간
- 최장 작업: ETCH-002 (4시간 30분)
- 최단 작업: CMP-001 (1시간)

⚠️ 주요 이슈:
1. DEP-003: CVD 공정에서 오류 발생
   - 원인: 가스 공급 시스템 이상
   - 조치: 즉시 엔지니어 파견 필요

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

  const filteredData = equipmentData.filter(equipment => {
    const matchesSearch = equipment.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFab = selectedFab === 'all' || equipment.fab === selectedFab;
    const matchesStatus = selectedStatus === 'all' || equipment.status === selectedStatus;
    return matchesSearch && matchesFab && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-800';
      case '진행중': return 'bg-blue-100 text-blue-800';
      case '대기': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case '정상': return 'bg-green-100 text-green-800';
      case '지연': return 'bg-yellow-100 text-yellow-800';
      case '오류': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment History</h1>
            <p className="text-gray-600 mt-2">설비 작업 이력 및 성능 분석</p>
          </div>
          <button
            onClick={handleAiAnalysis}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bot className="w-5 h-5" />
            <span>AI 분석</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설비 검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="설비 ID 또는 이름 검색"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                팹 선택
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFab}
                onChange={(e) => setSelectedFab(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="M14">M14</option>
                <option value="M15">M15</option>
                <option value="M16">M16</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 선택
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="완료">완료</option>
                <option value="진행중">진행중</option>
                <option value="대기">대기</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Data Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  설비 이력 ({filteredData.length}건)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        설비 ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        설비명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        팹
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LOT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        결과
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        소요시간
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span>{equipment.equipmentId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipment.equipmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipment.fab}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipment.operation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipment.lotNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(equipment.status)}`}>
                            {equipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(equipment.result)}`}>
                            {equipment.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipment.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Analysis Panel */}
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
                        {aiAnalysis}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}