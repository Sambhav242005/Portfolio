import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function AnalyticsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!data) return <div>Failed to load analytics</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="bg-muted/30 p-4 rounded-xl">
        <h2 className="text-xl font-semibold">Traffic Analytics</h2>
        <p className="text-sm text-muted-foreground">Page views and visitor statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-2xl bg-card">
          <p className="text-muted-foreground text-sm font-medium">All Time Views</p>
          <h3 className="text-4xl font-bold mt-2">{data.totalViews}</h3>
        </div>
        <div className="p-6 border rounded-2xl bg-card text-primary">
          <p className="text-primary/70 text-sm font-medium">Views Today</p>
          <h3 className="text-4xl font-bold mt-2">{data.viewsToday}</h3>
        </div>
        <div className="p-6 border rounded-2xl bg-card">
          <p className="text-muted-foreground text-sm font-medium">Views This Week</p>
          <h3 className="text-4xl font-bold mt-2">{data.viewsThisWeek}</h3>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-card h-96">
        <h3 className="text-lg font-semibold mb-6">Activity Last 7 Days</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--muted-foreground)'}} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--muted-foreground)'}}
            />
            <Tooltip 
              cursor={{fill: 'var(--muted)'}}
              contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 border rounded-2xl bg-card">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="space-y-4">
          {data.topPages.map((page: any, i: number) => (
            <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{page.path}</span>
              <span className="font-semibold">{page.count} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
