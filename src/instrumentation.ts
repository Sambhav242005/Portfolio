import fs from 'fs';
import path from 'path';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const analyticsPath = path.join(process.cwd(), 'src/data/analytics.json');
    
    const emptyData = {
      views: [],
      totalViews: 0,
      uniqueVisitors: 0
    };

    try {
      // Ensure directory exists
      const dir = path.dirname(analyticsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(analyticsPath, JSON.stringify(emptyData, null, 2), 'utf8');
      console.log('✅ Analytics log cleared on server restart.');
    } catch (error) {
      console.error('❌ Failed to clear analytics on restart:', error);
    }
  }
}
