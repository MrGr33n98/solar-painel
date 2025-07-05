"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  Search, 
  ShoppingCart, 
  Package, 
  User,
  Heart,
  Menu,
  X,
  Zap,
  Calculator,
  Scale
} from 'lucide-react';

const navigation = [
  { name: 'Marketplace', href: '/buyer/marketplace', icon: Store },
  { name: 'Simulador Solar', href: '/buyer/simulator', icon: Calculator },
  { name: 'Comparar Produtos', href: '/buyer/compare', icon: Scale },
  { name: 'Cart', href: '/buyer/cart', icon: ShoppingCart },
  { name: 'My Orders', href: '/buyer/orders', icon: Package },
  { name: 'Wishlist', href: '/buyer/wishlist', icon: Heart },
  { name: 'Account', href: '/buyer/account', icon: User },
];

export default function BuyerSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">SolarHub</span>
          </div>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}