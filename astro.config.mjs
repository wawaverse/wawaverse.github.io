import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkInlineFootnotes } from './src/plugins/remarkInlineFootnotes.mjs';

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
