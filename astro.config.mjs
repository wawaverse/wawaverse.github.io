import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yaoi.foundation',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkInlineFootnotes],
    shikiConfig: {
      theme: 'rose-pine',
      wrap: true
    }
  }
});
