import fs from 'fs';
import path from 'path';

const analyticsPath = path.join(process.cwd(), 'src/data/analytics.json');
const emptyData = {
  views: [],
  totalViews: 0,
  uniqueVisitors: 0
};

try {
  fs.writeFileSync(analyticsPath, JSON.stringify(emptyData, null, 2), 'utf8');
  console.log('✅ Analytics log cleared successfully.');
} catch (error) {
  console.error('❌ Failed to clear analytics:', error);
  process.exit(1);
}
