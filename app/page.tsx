"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authService = AuthService.getInstance();
    const user = authService.getCurrentUser();

    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'buyer':
          router.push('/buyer/marketplace');
          break;
        case 'vendor':
          router.push('/vendor/dashboard');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>
  );
}