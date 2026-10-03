import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  site: 'https://yaoi.foundation',
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const htmlPath = url.pathname.endsWith('.html')
          ? path.join('./dist', url.pathname)
          : path.join('./dist', url.pathname, 'index.html');
        if (fs.existsSync(htmlPath)) {
          const content = fs.readFileSync(htmlPath, 'utf-8');
          if (content.includes('name="robots" content="noindex"')) {
            return undefined;
          }
        }
        return item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'rose-pine',
      wrap: true
    }
  }
});
