'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Bot, ArrowLeft, AlertTriangle, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';

interface ReturnHistory {
  id: string;
  returnId: string;
  lotNumber: string;
  product: string;
  fab: string;
  returnReason: string;
  returnStep: string;
  returnDate: string;
  returnBy: string;
  targetStep: string;
  status: string;
  severity: string;
  resolvedDate?: string;
  comments?: string;
}

export default function ReturnHistoryPage() {
  const [returnData, setReturnData] = useState<ReturnHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFab, setSelectedFab] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockData: ReturnHistory[] = [
      {
        id: '1',
        returnId: 'RET-001',
        lotNumber: 'LOT001',
        product: 'Product A',
        fab: 'M14',
        returnReason: '품질 불량',
        returnStep: 'Lithography',
        returnDate: '2024-08-01 14:30:00',
        returnBy: '김품질',
        targetStep: 'Clean',
        status: '해결완료',
        severity: 'High',
        resolvedDate: '2024-08-01 16:45:00',
        comments: 'PR 두께 재조정 후 재처리 완료'
      },
      {
        id: '2',
        returnId: 'RET-002',
        lotNumber: 'LOT002',
        product: 'Product B',
        fab: 'M15',
        returnReason: '설비 오염',
        returnStep: 'Etching',
        returnDate: '2024-08-01 11:15:00',
        returnBy: '이공정',
        targetStep: 'Pre-Clean',
        status: '처리중',
        severity: 'Medium',
        comments: '챔버 클리닝 후 재진입 예정'
      },
      {
        id: '3',
        returnId: 'RET-003',
        lotNumber: 'LOT003',
        product: 'Product C',
        fab: 'M16',
        returnReason: '측정값 이상',
        returnStep: 'Measurement',
        returnDate: '2024-08-01 09:45:00',
        returnBy: '박측정',
        targetStep: 'CMP',
        status: '분석중',
        severity: 'Low',
        comments: '재측정 결과 대기 중'
      },
      {
        id: '4',
        returnId: 'RET-004',
        lotNumber: 'LOT004',
        product: 'Product A',
        fab: 'M14',
        returnReason: '공정 파라미터 오류',
        returnStep: 'Deposition',
        returnDate: '2024-07-31 16:20:00',
        returnBy: '최공정',
        targetStep: 'Strip',
        status: '해결완료',
        severity: 'High',
        resolvedDate: '2024-08-01 08:30:00',
        comments: '레시피 수정 후 재처리 완료'
      }
    ];
    setReturnData(mockData);
  }, []);

  const filteredData = returnData.filter(ret => {
    const matchesSearch = ret.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ret.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ret.returnReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFab = selectedFab === 'all' || ret.fab === selectedFab;
    const matchesSeverity = selectedSeverity === 'all' || ret.severity === selectedSeverity;
    return matchesSearch && matchesFab && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '해결완료': return 'bg-green-100 text-green-800';
      case '처리중': return 'bg-blue-100 text-blue-800';
      case '분석중': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">반송 이력 조회</h1>
            <p className="text-gray-600 mt-2">Lot 반송 이력 및 처리 현황 조회</p>
          </div>
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI 분석</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">총 반송</h3>
              <ArrowLeft className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{returnData.length}</div>
            <p className="text-sm text-gray-600 mt-2">전체 반송 건수</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">해결완료</h3>
              <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {returnData.filter(ret => ret.status === '해결완료').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">처리 완료됨</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">처리중</h3>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {returnData.filter(ret => ret.status === '처리중').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">현재 처리 중</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">High 심각도</h3>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {returnData.filter(ret => ret.severity === 'High').length}
            </div>
            <p className="text-sm text-gray-600 mt-2">긴급 조치 필요</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="반송ID, LOT번호, 반송사유 검색"
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
                심각도
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
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

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              반송 이력 목록 ({filteredData.length}건)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    반송 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LOT 번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    팹
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    반송 사유
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    심각도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    반송일시
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4 text-orange-600" />
                        <span>{returnItem.returnId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.lotNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.fab}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.returnReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(returnItem.severity)}`}>
                        {returnItem.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(returnItem.status)}`}>
                        {returnItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.returnDate.split(' ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        agentType="return"
      />
    </div>
  );
}