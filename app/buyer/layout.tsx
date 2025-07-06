import { redirect } from 'next/navigation';
import BuyerSidebar from '@/components/layout/buyer-sidebar';
import Header from '@/components/layout/header';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!user || user.role !== 'BUYER') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerSidebar />
      <div className="lg:ml-64">
        <Header user={user} title="Solar Marketplace" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}