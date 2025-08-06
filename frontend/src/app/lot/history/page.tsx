'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Bot, MessageCircle } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';

interface LotData {
  id: string;
  lotNumber: string;
  product: string;
  fab: string;
  status: string;
  startTime: string;
  endTime?: string;
  step: string;
  equipment: string;
}

export default function LotHistoryPage() {
  const [lotData, setLotData] = useState<LotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFab, setSelectedFab] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockData: LotData[] = [
      {
        id: '1',
        lotNumber: 'LOT001',
        product: 'Product A',
        fab: 'M14',
        status: '완료',
        startTime: '2024-08-01 09:00:00',
        endTime: '2024-08-01 15:30:00',
        step: 'Step 5',
        equipment: 'EQP-001'
      },
      {
        id: '2',
        lotNumber: 'LOT002',
        product: 'Product B',
        fab: 'M15',
        status: '진행중',
        startTime: '2024-08-01 10:00:00',
        step: 'Step 3',
        equipment: 'EQP-002'
      },
      {
        id: '3',
        lotNumber: 'LOT003',
        product: 'Product C',
        fab: 'M16',
        status: '대기',
        startTime: '2024-08-01 11:00:00',
        step: 'Step 1',
        equipment: 'EQP-003'
      }
    ];
    setLotData(mockData);
  }, []);

  const filteredData = lotData.filter(lot => {
    const matchesSearch = lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFab = selectedFab === 'all' || lot.fab === selectedFab;
    return matchesSearch && matchesFab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-800';
      case '진행중': return 'bg-blue-100 text-blue-800';
      case '대기': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
                LOT 검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="LOT 번호 또는 제품명 검색"
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
              Lot 목록 ({filteredData.length}개)
            </h3>
          </div>
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
                        {lot.status}
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