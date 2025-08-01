'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Package, 
  Settings, 
  Truck,
  History,
  Activity
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Home',
    icon: <Home className="w-5 h-5" />,
    path: '/'
  },
  {
    title: 'Lot',
    icon: <Package className="w-5 h-5" />,
    children: [
      {
        title: 'Lot History',
        icon: <History className="w-4 h-4" />,
        path: '/lot/history'
      },
      {
        title: 'Lot Status',
        icon: <Activity className="w-4 h-4" />,
        path: '/lot/status'
      }
    ]
  },
  {
    title: 'Equipment',
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        title: 'Eqp History',
        icon: <History className="w-4 h-4" />,
        path: '/equipment/history'
      },
      {
        title: 'Eqp Status',
        icon: <Activity className="w-4 h-4" />,
        path: '/equipment/status'
      }
    ]
  },
  {
    title: '반송',
    icon: <Truck className="w-5 h-5" />,
    children: [
      {
        title: '반송 이력 조회',
        icon: <History className="w-4 h-4" />,
        path: '/return/history'
      }
    ]
  }
];

export default function Navigation() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.path === pathname;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title}>
        <div
          className={`
            flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200
            ${level === 0 ? 'border-b border-gray-200' : 'ml-4'}
            ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'hover:bg-gray-50 text-gray-700'}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.title);
            } else if (item.path) {
              window.location.href = item.path;
            }
          }}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
          {hasChildren && (
            <div className="text-gray-400">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI MES</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            Manufacturing Execution System
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>
    </nav>
  );
}