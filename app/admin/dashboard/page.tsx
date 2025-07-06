"use client";

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import StatsCard from '@/components/dashboard/stats-card';
import RecentOrders from '@/components/dashboard/recent-orders';
import { Users, Building2, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const dataService = DataService.getInstance();
      const data = await dataService.getAnalytics();
      setAnalytics(data);
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers}
          change="+12% from last month"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Vendors"
          value={analytics.totalVendors}
          change="+8% from last month"
          icon={Building2}
          color="green"
        />
        <StatsCard
          title="Total Products"
          value={analytics.totalProducts}
          change="+15% from last month"
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Total Orders"
          value={analytics.totalOrders}
          change="+5% from last month"
          icon={ShoppingCart}
          color="orange"
        />
        <StatsCard
          title="Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+18% from last month"
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={analytics.recentOrders} />
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Vendors</span>
              <span className="font-semibold">{analytics.totalVendors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="font-semibold text-orange-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Growth</span>
              <span className="font-semibold text-green-600">+{analytics.monthlyGrowth}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}