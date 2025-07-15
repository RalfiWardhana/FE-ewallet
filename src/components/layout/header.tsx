import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">CE</span>
            </div>
            <span className="text-xl font-semibold">CashEase</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600">
              Wallet
            </Link>
            <Link href="/laporan" className="text-gray-700 hover:text-purple-600">
              Laporan
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}