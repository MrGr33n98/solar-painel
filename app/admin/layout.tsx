"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import AdminSidebar from '@/components/layout/admin-sidebar';
import Header from '@/components/layout/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authService = AuthService.getInstance();
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <Header user={user} title="Admin Dashboard" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}