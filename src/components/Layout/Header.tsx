'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#6E32B9] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CashEase</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`relative font-medium transition-colors pb-1 ${
                pathname === '/' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Wallet
              {pathname === '/' && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#6E32B9]"></span>
              )}
            </Link>
            <Link 
              href="/laporan" 
              className={`relative font-medium transition-colors pb-1 ${
                pathname === '/laporan' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Laporan
              {pathname === '/laporan' && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#6E32B9]"></span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}