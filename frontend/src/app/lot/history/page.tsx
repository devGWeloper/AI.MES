'use client';

import { useState, useEffect } from 'react';
import { Search, Download, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';
import { lotApi } from '@/lib/apiClient';
import type { ApiResponse, LotData as LotDataType } from '@/types';

export default function LotHistoryPage() {
  const [lotData, setLotData] = useState<LotDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFab, setSelectedFab] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // 데이터 조회 (백엔드 API) - LOT 번호 기반 검색
  const fetchLotHistory = async () => {
    if (!searchTerm.trim()) {
      alert('LOT 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await lotApi.searchLots(
        searchTerm.trim(),
        selectedFab !== 'all' ? selectedFab : undefined
      );
      
      const raw = (response?.data ?? []) as any[];
      const normalizeLot = (item: any): LotDataType => ({
        id: item.id,
        lotNumber: item.lotNumber ?? item.lot_number,
        product: item.product,
        fab: item.fab,
        status: item.status,
        startTime: item.startTime ?? item.start_time,
        endTime: item.endTime ?? item.end_time,
        step: item.step,
        equipment: item.equipment,
        progress: item.progress,
        estimatedCompletion: item.estimatedCompletion ?? item.estimated_completion,
      });
      setLotData(raw.map(normalizeLot));
      
      if (raw.length === 0) {
        alert('검색 결과가 없습니다.');
      }
    } catch (error: any) {
      console.error('Lot 이력 조회 실패', error);
      setLotData([]);
      alert(error.message || '조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이제 서버에서 필터링된 결과를 받으므로 클라이언트 필터링 불필요
  const filteredData = lotData;

  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in_progress':
        return '진행중';
      case 'waiting':
        return '대기';
      case 'error':
        return '오류';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lot History</h1>
            <p className="text-gray-600 mt-2">Lot 처리 이력 및 현황을 확인하세요</p>
          </div>
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI 분석</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LOT 번호 입력 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="LOT 번호를 입력하세요"
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
            
            <div className="flex items-end justify-end gap-2">
              <button
                onClick={fetchLotHistory}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-white ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                aria-label="조회"
              >
                <span>{loading ? '조회중...' : '조회'}</span>
              </button>
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
              Lot 목록 ({filteredData.length}개)
            </h3>
          </div>
          {loading && (
            <div className="p-6 text-sm text-gray-500">조회 중...</div>
          )}
          {!loading && lotData.length === 0 && (
            <div className="p-6 text-sm text-gray-500 text-center">
              LOT 번호를 입력하고 조회 버튼을 눌러주세요.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    현재 공정
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설비
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((lot) => (
                  <tr key={lot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lot.lotNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lot.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lot.fab}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lot.status)}`}>
                        {translateStatus(lot.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lot.step}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lot.equipment}
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
        agentType="lot"
      />
    </div>
  );
}