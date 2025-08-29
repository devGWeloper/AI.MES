'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Bot, Settings, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';
import { equipmentApi } from '@/api';
import { getStatusColor, getResultColor } from '@/common';
import type { ApiResponse, EquipmentData as EquipmentDataType } from '@/types';

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // 데이터 조회 (백엔드 API) - 설비 ID 기반 검색
  const fetchEquipmentHistory = async () => {
    if (!searchTerm.trim()) {
      alert('설비 ID 또는 설비명을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await equipmentApi.searchEquipment(
        searchTerm.trim(),
        selectedFab !== 'all' ? selectedFab : undefined
      );
      
      const raw = (response?.data ?? []) as any[];
      const normalizeEquipment = (item: any): EquipmentHistory => ({
        id: item.id,
        equipmentId: item.equipmentId ?? item.equipment_id,
        equipmentName: item.equipmentName ?? item.equipment_name,
        fab: item.fab,
        operation: item.operation ?? item.current_operation ?? 'N/A',
        startTime: item.startTime ?? item.start_time ?? '',
        endTime: item.endTime ?? item.end_time,
        duration: item.duration ?? 'N/A',
        status: item.status,
        lotNumber: item.lotNumber ?? item.lot_number ?? item.current_lot,
        result: item.result ?? 'N/A',
      });
      setEquipmentData(raw.map(normalizeEquipment));
      
      if (raw.length === 0) {
        alert('검색 결과가 없습니다.');
      }
    } catch (error: any) {
      console.error('설비 이력 조회 실패', error);
      setEquipmentData([]);
      alert(error.message || '조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이제 서버에서 필터링된 결과를 받으므로 클라이언트 필터링 불필요
  const filteredData = equipmentData;

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
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI 분석</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설비 ID/명 입력 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="설비 ID 또는 설비명을 입력하세요"
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
            
            <div className="flex items-end justify-end gap-2">
              <button
                onClick={fetchEquipmentHistory}
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
              설비 이력 ({filteredData.length}건)
            </h3>
          </div>
          {loading && (
            <div className="p-6 text-sm text-gray-500">조회 중...</div>
          )}
          {!loading && equipmentData.length === 0 && (
            <div className="p-6 text-sm text-gray-500 text-center">
              설비 ID 또는 설비명을 입력하고 조회 버튼을 눌러주세요.
            </div>
          )}
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

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        agentType="equipment"
        context={{
          pageType: 'equipment_history',
          equipmentData: filteredData,
          searchTerm: searchTerm,
          selectedFab: selectedFab,
          selectedStatus: selectedStatus,
          totalCount: filteredData.length
        }}
      />
    </div>
  );
}