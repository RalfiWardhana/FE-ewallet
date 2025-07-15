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
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CashEase</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                pathname === '/' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Wallet
            </Link>
            <Link 
              href="/laporan" 
              className={`font-medium transition-colors ${
                pathname === '/laporan' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Laporan
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}