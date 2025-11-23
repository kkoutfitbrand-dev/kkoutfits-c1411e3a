import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueChange, setRevenueChange] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch orders count and total revenue
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_cents');

        const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_cents, 0) || 0;

        // Fetch customers count
        const { count: customersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch recent orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersData?.length || 0,
          totalCustomers: customersCount || 0,
          totalRevenue: totalRevenue / 100,
        });

        setRecentOrders(orders || []);

        // Fetch sales data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const salesByDay = await Promise.all(
          last7Days.map(async (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const { data } = await supabase
              .from('orders')
              .select('total_cents')
              .gte('created_at', date)
              .lt('created_at', nextDay.toISOString().split('T')[0]);

            const revenue = data?.reduce((sum, order) => sum + order.total_cents, 0) || 0;
            const orderCount = data?.length || 0;

            return {
              date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
              revenue: revenue / 100,
              orders: orderCount,
            };
          })
        );

        setSalesData(salesByDay);

        // Calculate revenue change
        const yesterdayRevenue = salesByDay[salesByDay.length - 2]?.revenue || 0;
        const todayRevenue = salesByDay[salesByDay.length - 1]?.revenue || 0;
        const change = yesterdayRevenue > 0 
          ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
          : 0;
        setRevenueChange(change);

        // Fetch top selling products
        const { data: allOrders } = await supabase
          .from('orders')
          .select('order_items');

        const productSales = new Map();
        allOrders?.forEach((order) => {
          const items = order.order_items as any[];
          items?.forEach((item: any) => {
            const current = productSales.get(item.product_id) || { title: item.title, quantity: 0, revenue: 0 };
            current.quantity += item.quantity;
            current.revenue += (item.price_cents / 100) * item.quantity;
            productSales.set(item.product_id, current);
          });
        });

        const topProductsArray = Array.from(productSales.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopProducts(topProductsArray);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
          />
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
          />
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Trend Chart */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Revenue Analytics</CardTitle>
                  <CardDescription className="mt-1">
                    Daily revenue performance over the last 7 days
                  </CardDescription>
                </div>
                {!loading && revenueChange !== 0 && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    revenueChange > 0 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {revenueChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(revenueChange).toFixed(1)}%
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : salesData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No sales data available
                </div>
              ) : (
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Revenue',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                        />} 
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Products Chart */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Top Performing Products</CardTitle>
              <CardDescription className="mt-1">
                Best-selling products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No product data available
                </div>
              ) : (
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Revenue',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={topProducts} 
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <YAxis 
                        type="category"
                        dataKey="title" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        width={120}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value, name) => {
                            if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                            return [value, name];
                          }}
                        />} 
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 8, 8, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {order.profiles?.name || 'Unknown Customer'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₹{(order.total_cents / 100).toLocaleString('en-IN')}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
