import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set proper headers for text
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    
    // Read the generated robots.txt from public directory
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      res.status(200).send(robotsContent);
    } else {
      // Fallback: generate a basic robots.txt if file doesn't exist
      const basicRobots = `# *
User-agent: *
Allow: /

# Host
Host: https://www.samanportable.com

# Sitemaps
Sitemap: https://www.samanportable.com/sitemap.xml`;
      
      res.status(200).send(basicRobots);
    }
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    
    // Return a basic robots.txt on error
    const errorRobots = `# *
User-agent: *
Allow: /

# Host
Host: https://www.samanportable.com

# Sitemaps
Sitemap: https://www.samanportable.com/sitemap.xml`;
    
    res.status(200).send(errorRobots);
  }
}
