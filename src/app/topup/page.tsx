'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import TopupModal from '@/components/Modals/TopupModal';

export default function TopupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <TopupModal 
          user={null}
          onClose={() => router.push('/')}
          onSuccess={() => router.push('/')}
          standalone={true}
        />
      </main>

      <Footer />
    </div>
  );
}