'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Home, 
  Package, 
  Settings, 
  Truck,
  History,
  Activity,
  Accessibility
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
    path: '/dashboard'
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  

  // 랜딩페이지(/)에서는 네비게이션을 숨김 (모든 훅 선언 이후에 처리)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // (접근성 토글 제거)

  // 모든 훅 호출 이후에 조건부 렌더링 수행 (Hook 순서 불변)
  if (pathname === '/') {
    return null;
  }

  const handleMouseEnter = (itemTitle: string) => {
    setIsHovering(itemTitle);
    if (openDropdown !== itemTitle) {
      setOpenDropdown(itemTitle);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(null);
    // 마우스가 떠나도 바로 닫지 않고 약간의 지연을 둠
    setTimeout(() => {
      if (!isHovering) {
        setOpenDropdown(null);
      }
    }, 100);
  };

  const handleDropdownClick = (itemTitle: string) => {
    if (openDropdown === itemTitle) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(itemTitle);
    }
  };

  const handleMenuItemClick = (path?: string) => {
    if (path) {
      setOpenDropdown(null);
      setIsHovering(null);
      router.push(path);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = item.path === pathname;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item.title;

    return (
      <div 
        key={item.title}
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.title)}
        onMouseLeave={handleMouseLeave}
        ref={(el) => {
          if (hasChildren) {
            dropdownRefs.current[item.title] = el;
          }
        }}
      >
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 focus-ring
            ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}
          `}
          onClick={() => {
            if (hasChildren) {
              handleDropdownClick(item.title);
            } else {
              handleMenuItemClick(item.path);
            }
          }}
          role="button"
          aria-haspopup={hasChildren ? 'menu' : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (hasChildren) {
                handleDropdownClick(item.title);
              } else {
                handleMenuItemClick(item.path);
              }
            }
          }}
        >
          {item.icon}
          <span className="font-medium">{item.title}</span>
          {hasChildren && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
        
        {/* Dropdown Menu */}
        {hasChildren && isOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 z-50" role="menu">
            {item.children!.map(child => (
              <div
                key={child.title}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 focus-ring
                  ${child.path === pathname ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}
                `}
                onClick={() => handleMenuItemClick(child.path)}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuItemClick(child.path);
                  }
                }}
              >
                {child.icon}
                <span className="font-medium">{child.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200/60">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 text-white p-2 rounded-xl shadow-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 leading-none block">AI MES</span>
              <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">Manufacturing Execution System</span>
            </div>
          </Link>
          <div className="flex items-center gap-2" />
        </div>

        {/* Horizontal Menu */}
        <div className="flex items-center gap-2 px-6 pb-3" role="navigation" aria-label="주요 메뉴">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>
    </nav>
  );
}