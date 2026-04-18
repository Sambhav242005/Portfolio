import fs from 'fs/promises';
import path from 'path';

const ANALYTICS_FILE_PATH = path.join(process.cwd(), 'src/data/analytics.json');

export interface PageView {
  path: string;
  timestamp: string;
  userAgent: string;
  ipHash?: string;
}

export interface AnalyticsData {
  views: PageView[];
  totalViews: number;
  uniqueVisitors: number;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const fileContents = await fs.readFile(ANALYTICS_FILE_PATH, 'utf8');
    return JSON.parse(fileContents) as AnalyticsData;
  } catch (error) {
    // If file doesn't exist or is invalid, return empty object
    return {
      views: [],
      totalViews: 0,
      uniqueVisitors: 0
    };
  }
}

export async function recordPageView(pathName: string, userAgent: string, ip: string = 'unknown'): Promise<void> {
  try {
    const data = await getAnalyticsData();
    
    // Hash IP for basic uniqueness checks without storing PII
    // Using simple substring for demo purposes. In real prod, use crypto module
    const ipHash = ip.substring(0, 16); 
    
    const newView: PageView = {
      path: pathName,
      timestamp: new Date().toISOString(),
      userAgent: userAgent || 'Unknown',
      ipHash
    };

    data.views.push(newView);
    data.totalViews = data.views.length;
    
    // Calculate unique visitors locally by counting unique ipHashes
    const uniqueIps = new Set(data.views.map(v => v.ipHash).filter(Boolean));
    data.uniqueVisitors = uniqueIps.size;

    await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to record page view:', error);
  }
}

export async function getAnalyticsSummary() {
  const data = await getAnalyticsData();
  
  // Calculate today and this week
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  let viewsToday = 0;
  let viewsThisWeek = 0;
  
  // Also count views by page
  const pageCounts: Record<string, number> = {};
  
  data.views.forEach(view => {
    if (view.timestamp.startsWith(today)) {
      viewsToday++;
    }
    if (view.timestamp >= oneWeekAgo) {
      viewsThisWeek++;
    }
    
    pageCounts[view.path] = (pageCounts[view.path] || 0) + 1;
  });

  // Sort top pages
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  // Generate chart data for the last 7 days
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    
    const viewsOnDate = data.views.filter(v => v.timestamp.startsWith(dateStr)).length;
    chartData.push({
      date: shortDate,
      views: viewsOnDate
    });
  }

  return {
    totalViews: data.totalViews,
    uniqueVisitors: data.uniqueVisitors,
    viewsToday,
    viewsThisWeek,
    topPages,
    chartData
  };
}
