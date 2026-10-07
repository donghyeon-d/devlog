---
title: "GitHub Actions로 Astro 블로그 자동 배포하기"
description: "git push 만 하면 GitHub Actions 가 Astro 사이트를 빌드하고 GitHub Pages 에 배포하도록 워크플로를 구성합니다."
date: 2026-09-28
category: "DevOps"
tags:
  - GitHub Actions
  - Astro
  - CI/CD
---

이 블로그는 Markdown 파일을 커밋하면 자동으로 배포됩니다. 그 과정을 정리합니다.

## 배포 흐름

```text
git push
  → GitHub Actions
    → npm ci
    → astro build + pagefind
  → GitHub Pages deploy
```

## 워크플로 파일

`.github/workflows/deploy.yml` 의 핵심 부분입니다.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
```

> [!NOTE]
> 저장소의 **Settings → Pages → Build and deployment → Source** 를 `GitHub Actions` 로 바꿔야 배포가 동작합니다.

## base 경로

`username.github.io/devlog` 처럼 하위 경로에 배포한다면 Astro 의 `base` 옵션이 필요합니다. 이 블로그는 환경 변수로 주입합니다.

```ts
// astro.config.ts
const site = process.env.SITE || 'https://example.github.io';
const base = process.env.BASE || '/';

export default defineConfig({ site, base });
```

내부 링크는 항상 헬퍼를 거쳐 만들어서 경로가 바뀌어도 깨지지 않게 합니다.

```ts
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
```

## 빌드 결과 확인

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview"
  }
}
```

로컬에서 `npm run build && npm run preview` 로 실제 배포될 결과물과 검색 기능까지 확인할 수 있습니다.
