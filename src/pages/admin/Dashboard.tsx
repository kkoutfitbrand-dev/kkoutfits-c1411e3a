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
            const itemId = item.product_id || item.combo_id || item.id;
            const itemTitle = item.title || item.name || 'Unknown Product';
            // Handle both price_cents (in paise) and price (in rupees)
            const priceInRupees = item.price_cents ? item.price_cents / 100 : (item.price || 0);
            const current = productSales.get(itemId) || { title: itemTitle, quantity: 0, revenue: 0 };
            current.quantity += item.quantity || 1;
            current.revenue += priceInRupees * (item.quantity || 1);
            productSales.set(itemId, current);
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
          {/* Revenue Analytics Card */}
          <Card className="shadow-xl border-border/40 overflow-hidden relative bg-gradient-to-br from-card to-card/95">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Daily revenue performance over the last 7 days
                  </CardDescription>
                </div>
                {!loading && revenueChange !== 0 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm animate-fade-in ${
                    revenueChange > 0 
                      ? 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                      : 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
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
              
              {/* Summary Stats */}
              {!loading && salesData.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                    <p className="text-lg font-bold">
                      ₹{salesData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Avg Daily</p>
                    <p className="text-lg font-bold">
                      ₹{(salesData.reduce((sum, day) => sum + day.revenue, 0) / salesData.length).toFixed(0)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Peak Day</p>
                    <p className="text-lg font-bold">
                      ₹{Math.max(...salesData.map(d => d.revenue)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[320px] w-full rounded-lg" />
                </div>
              ) : salesData.length === 0 ? (
                <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground">
                  <DollarSign className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-medium">No sales data available</p>
                  <p className="text-sm">Start making sales to see analytics</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Revenue',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="shadow">
                          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))" 
                        opacity={0.2} 
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                        dx={-10}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl"
                          formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                        />} 
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                        filter="url(#shadow)"
                        dot={{ 
                          fill: 'hsl(var(--primary))', 
                          strokeWidth: 2, 
                          r: 4,
                          stroke: 'hsl(var(--background))'
                        }}
                        activeDot={{ 
                          r: 6, 
                          strokeWidth: 2,
                          stroke: 'hsl(var(--background))'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Products Card */}
          <Card className="shadow-xl border-border/40 overflow-hidden relative bg-gradient-to-br from-card to-card/95">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
            <CardHeader className="relative z-10">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  Top Performing Products
                </CardTitle>
                <CardDescription className="text-sm">
                  Best-selling products ranked by total revenue
                </CardDescription>
              </div>
              
              {/* Summary Stats */}
              {!loading && topProducts.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                    <p className="text-lg font-bold">
                      ₹{topProducts.reduce((sum, p) => sum + (p.revenue || 0), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Units Sold</p>
                    <p className="text-lg font-bold">
                      {topProducts.reduce((sum, p) => sum + (p.quantity || 0), 0)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Top Product</p>
                    <p className="text-lg font-bold truncate">
                      {topProducts[0]?.title ? topProducts[0].title.split(' ').slice(0, 2).join(' ') : '-'}
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[320px] w-full rounded-lg" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-medium">No product data available</p>
                  <p className="text-sm">Products will appear here after orders</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Revenue',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={topProducts} 
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                      layout="horizontal"
                    >
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))" 
                        opacity={0.2}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <YAxis 
                        type="category"
                        dataKey="title" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                        tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl"
                          formatter={(value, name, props) => {
                            const quantity = props.payload.quantity;
                            return [
                              <>
                                <div className="font-semibold">₹{Number(value).toLocaleString('en-IN')}</div>
                                <div className="text-xs text-muted-foreground">{quantity} units sold</div>
                              </>,
                              'Revenue'
                            ];
                          }}
                        />} 
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#colorBar)"
                        radius={[0, 8, 8, 0]}
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                        maxBarSize={40}
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
