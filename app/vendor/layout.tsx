import { redirect } from 'next/navigation';
import VendorSidebar from '@/components/layout/vendor-sidebar';
import Header from '@/components/layout/header';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function VendorLayout({
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

  if (!user || user.role !== 'VENDOR') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorSidebar />
      <div className="lg:ml-64">
        <Header user={user} title="Vendor Portal" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}