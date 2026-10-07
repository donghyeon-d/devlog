import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownPlugins } from './src/plugins/markdown';

/**
 * 배포 주소 설정
 *
 * - SITE: 사이트의 origin (예: https://username.github.io)
 * - BASE: 하위 경로 (예: /devlog). 사용자 페이지(username.github.io 저장소)나
 *   커스텀 도메인이면 '/' 를 사용한다.
 *
 * GitHub Actions 에서는 actions/configure-pages 의 출력값으로 자동 주입된다.
 * 로컬에서는 기본값을 사용하므로 별도 설정 없이 동작한다.
 */
const site = process.env.SITE || 'https://example.github.io';
const base = process.env.BASE || '/';

export default defineConfig({
  site,
  base,
  // /blog/linux/wsl-keep-alive.html 형태로 생성해서
  // GitHub Pages 에서 확장자 없는 /blog/linux/wsl-keep-alive 로 접근한다.
  build: { format: 'file' },
  integrations: [
    sitemap({
      // 검색/404 페이지는 색인 대상에서 제외
      filter: (page) => !/\/(search|404)(\.html)?$/.test(page),
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
    processor: satteri({
      features: {
        gfm: true,
        // 개발 글에서는 따옴표/대시가 자동 변환되지 않는 편이 복사·붙여넣기에 안전하다.
        smartPunctuation: false,
      },
      hastPlugins: markdownPlugins(base),
    }),
  },
  // 링크에 마우스를 올리면 다음 페이지를 미리 받아와 이동을 빠르게 한다.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
