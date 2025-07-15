'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import CreateUserModal from '@/components/Modals/CreateUserModal';

export default function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <CreateUserModal 
          onClose={() => router.push('/')}
          onSuccess={() => router.push('/')}
          standalone={true}
        />
      </main>

      <Footer />
    </div>
  );
}