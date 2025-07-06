"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { AuthService } from '@/lib/auth';
import StatsCard from '@/components/dashboard/stats-card';
import RecentOrders from '@/components/dashboard/recent-orders';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authService = AuthService.getInstance();
      const dataService = DataService.getInstance();
      const currentUser = authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        const [prod, ord] = await Promise.all([
          dataService.getProductsByVendor(currentUser.id),
          dataService.getOrdersByVendor(currentUser.id),
        ]);
        setProducts(prod);
        setOrders(ord);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeProducts = products.filter(p => p.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={products.length}
          change={`${activeProducts} active`}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          change={`${pendingOrders} pending`}
          icon={ShoppingCart}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change="+12% from last month"
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Growth"
          value="15%"
          change="Monthly increase"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium">Add New Product</div>
              <div className="text-sm text-gray-600">List a new solar product</div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium">Update Inventory</div>
              <div className="text-sm text-gray-600">Manage stock levels</div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-gray-600">Check performance metrics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}