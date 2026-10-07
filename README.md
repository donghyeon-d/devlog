# devlog

Markdown 파일만 추가하면 정적 HTML 로 빌드되는 개인 기술 블로그입니다.

- **Astro 7** + TypeScript, 정적 사이트 생성(SSG)
- **Content Collections** 로 frontmatter 타입 검증
- **Shiki** 코드 하이라이팅 + Copy 버튼
- **Pagefind** 정적 검색 (검색 서버/DB 불필요)
- 카테고리 · 태그 · 목차(TOC) · 이전/다음 글 · 관련 글
- SEO: meta description, canonical, Open Graph, Twitter Card, JSON-LD, `sitemap.xml`, `robots.txt`, RSS
- UI 프레임워크 없이 정적 HTML + 최소한의 JavaScript (페이지당 수 KB)

---

## 개발 서버 실행

```bash
npm install
npm run dev
```

`http://localhost:4321` 에서 확인합니다. 글을 저장하면 바로 반영됩니다.

> 개발 서버에서는 `draft: true` 인 글도 보이며(제목 옆에 **Draft** 표시), 검색은 동작하지 않습니다.
> 검색 인덱스는 build 단계에서 생성되므로 아래의 `build` → `preview` 로 확인하세요.

## production build

```bash
npm run build
```

`astro build` 로 `dist/` 에 정적 파일을 생성한 뒤, `pagefind --site dist` 로 검색 인덱스(`dist/pagefind/`)를 만듭니다.

## production 미리보기

```bash
npm run preview
```

실제 배포될 결과물(검색 포함)을 로컬에서 확인할 수 있습니다.

## 타입 검사

```bash
npm run check
```

`.astro` / `.ts` 파일과 content 스키마의 타입 오류를 검사합니다.

---

## 새 글 작성 방법

### 1. 파일 만들기

`src/content/blog/` 아래에 **카테고리 성격의 폴더**를 만들고 Markdown 파일을 추가합니다.

```text
src/content/blog/linux/my-new-post.md
```

파일 경로가 그대로 URL 이 됩니다.

| 파일 | URL |
|---|---|
| `src/content/blog/linux/wsl-keep-alive.md` | `/blog/linux/wsl-keep-alive` |
| `src/content/blog/database/mysql-cast-int.md` | `/blog/database/mysql-cast-int` |
| `src/content/blog/flutter/go-router.md` | `/blog/flutter/go-router` |

- 파일명은 영문 소문자와 `-` 사용을 권장합니다. (URL 에 그대로 쓰입니다)
- `_` 로 시작하는 파일(`_memo.md`)은 빌드에서 무시됩니다.
- 폴더 이름은 URL 용이고, 화면에 보이는 카테고리는 frontmatter 의 `category` 값입니다.

템플릿이 `src/content/blog/_template.md` 에 있습니다. 복사해서 시작하세요.

```bash
cp src/content/blog/_template.md src/content/blog/linux/my-new-post.md
```

### 2. frontmatter 작성

```md
---
title: "MySQL에서 INT로 CAST하는 방법"
description: "MySQL에서 문자열을 INT 타입으로 변환하는 방법을 정리합니다."
date: 2026-09-16
updated: 2026-09-17
category: "Database"
tags:
  - MySQL
  - SQL
draft: false
---

# MySQL에서 INT로 CAST하는 방법

본문...
```

| 필드 | 필수 | 설명 |
|---|:---:|---|
| `title` | ✅ | 글 제목. `<title>`, `og:title` 에 사용 |
| `description` | ✅ | 요약. 목록, meta description, `og:description` 에 사용 |
| `date` | ✅ | 작성일 (`YYYY-MM-DD`) |
| `category` | ✅ | 카테고리. **자동 수집**되어 `/categories/<slug>` 페이지가 생성됨 |
| `tags` | ✅ | 태그 목록. **자동 수집**되어 `/tags/<slug>` 페이지가 생성됨 |
| `updated` | | 수정일. 작성일과 다르면 함께 표시 |
| `draft` | | `true` 면 production build 에서 제외 (기본값 `false`) |

필수 필드가 없거나 형식이 틀리면 빌드가 실패하면서 어떤 파일의 어떤 필드가 잘못됐는지 알려줍니다.
(스키마: `src/content.config.ts`)

- 본문이 `# 제목` 으로 시작하면 자동으로 제거됩니다. (페이지 제목과 중복 방지)
- 카테고리/태그 slug 는 소문자 + 하이픈으로 변환됩니다. 예) `Spring Boot` → `spring-boot`, `C++` → `cpp`
- 대소문자만 다른 태그(`MySQL`, `mysql`)는 같은 태그로 취급합니다.

### 3. 사용할 수 있는 Markdown 문법

GitHub Flavored Markdown(표, 체크리스트, 취소선, 각주)을 지원합니다.

````md
## H2 제목 → 목차에 표시
### H3 제목 → 목차에 표시

`inline code`, **굵게**, ~~취소선~~, [링크](https://astro.build)

```sql
SELECT CAST('123' AS SIGNED);
```

| Name | Description |
|---|---|
| MySQL | Database |

- [x] 완료
- [ ] 할 일

> [!NOTE]
> 참고할 내용입니다.

> [!WARNING]
> 주의해야 할 내용입니다.
````

- Callout: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`
- 코드 블록에는 언어 라벨과 **Copy** 버튼이 자동으로 붙습니다.
- 하이라이팅 언어: PHP, Java, JavaScript, TypeScript, Dart, SQL, Bash, JSON, YAML, HTML, CSS 등 Shiki 가 지원하는 모든 언어
- 모든 문법 예시는 `src/content/blog/backend/markdown-style-guide.md` (draft) 를 개발 서버에서 열어 확인할 수 있습니다.

### 4. 이미지

`public/` 아래에 이미지를 두고 절대 경로로 참조합니다.

```text
public/images/posts/mysql/example.png
```

```md
![설명](/images/posts/mysql/example.png)
```

- 본문 이미지는 자동으로 `loading="lazy"`, `decoding="async"` 가 적용됩니다.
- **이미지 최적화(WebP 변환, width/height 지정)**가 필요하면 이미지를 글 옆에 두고 상대 경로로 참조하세요.
  Astro 가 빌드 시 자동으로 최적화합니다.

  ```text
  src/content/blog/mysql/images/diagram.png
  ```

  ```md
  ![설명](./images/diagram.png)
  ```

- GitHub Pages 프로젝트 페이지처럼 base 경로(`/devlog` 등)에 배포해도, Markdown 안의 `/` 로 시작하는
  이미지·링크 경로에는 base 가 자동으로 붙습니다. 항상 `/images/...`, `/blog/...` 형태로 작성하면 됩니다.

---

## 블로그 설정

블로그 이름, 작성자, GitHub 링크, Hero 문구는 `src/config.ts` 에서 수정합니다.

```ts
export const SITE = {
  title: 'devlog',
  description: '개발하면서 공부하고 경험한 내용을 기록하는 기술 블로그입니다.',
  author: 'Dongchoi',
  github: 'https://github.com/',
  // ...
};
```

기본 Open Graph 이미지는 `public/og-default.png` (1200×630) 입니다.

---

## 프로젝트 구조

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages 자동 배포
├── astro.config.ts                # Astro 설정 (site/base, Markdown, sitemap)
├── public/                        # 그대로 복사되는 정적 파일 (favicon, 이미지, OG 이미지)
└── src/
    ├── config.ts                  # 블로그 기본 정보
    ├── content.config.ts          # Content Collection 스키마 (frontmatter 검증)
    ├── content/blog/              # ✍️ Markdown 글
    ├── components/
    │   ├── BaseHead.astro         # SEO / OG / Twitter / JSON-LD
    │   ├── Header.astro           # sticky 헤더, 검색창, 모바일 메뉴
    │   ├── Sidebar.astro          # 카테고리 / 태그 사이드바
    │   ├── Footer.astro
    │   ├── PostCard.astro         # 글 목록 항목
    │   ├── PostList.astro
    │   ├── PostMeta.astro         # 날짜 · 카테고리 · 읽기 시간
    │   ├── TableOfContents.astro  # 목차 (PC: 오른쪽 sticky, 모바일: 접이식)
    │   ├── PostNavigation.astro   # 이전 글 / 다음 글
    │   ├── RelatedPosts.astro     # 관련 글
    │   ├── PageHeader.astro
    │   ├── Tag.astro
    │   └── Icon.astro             # 인라인 SVG 아이콘
    ├── layouts/
    │   ├── BaseLayout.astro       # Header + Sidebar + Main + Footer
    │   └── BlogPostLayout.astro   # 글 상세 (TOC, Copy 버튼, scrollspy)
    ├── lib/
    │   ├── posts.ts               # 글 조회, 카테고리/태그 수집, 관련 글, 이전/다음 글
    │   └── utils.ts               # slugify, 날짜, 읽기 시간, base 경로
    ├── plugins/
    │   └── markdown.ts            # Callout, 코드 블록 헤더, 표 스크롤, 외부 링크 등
    ├── pages/
    │   ├── index.astro            # /
    │   ├── blog/index.astro       # /blog (연도별 전체 글)
    │   ├── blog/[...slug].astro   # /blog/<폴더>/<파일명>
    │   ├── categories/            # /categories, /categories/<slug>
    │   ├── tags/                  # /tags, /tags/<slug>
    │   ├── search.astro           # /search (Pagefind)
    │   ├── about.astro            # /about
    │   ├── 404.astro
    │   ├── rss.xml.ts             # /rss.xml
    │   └── robots.txt.ts          # /robots.txt
    └── styles/
        ├── global.css             # 디자인 토큰, 레이아웃, 컴포넌트
        └── prose.css              # Markdown 본문 스타일
```

---

## 배포 (GitHub Pages)

`git push` → GitHub Actions → Astro build + Pagefind → GitHub Pages 배포가 자동으로 이루어집니다.
워크플로: `.github/workflows/deploy.yml`

### 1. 저장소에 push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<repository>.git
git push -u origin main
```

### 2. GitHub Pages 소스 설정

저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 선택합니다.

### 3. 배포 확인

`main` 브랜치에 push 할 때마다 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로가 실행되고,
완료되면 아래 주소로 접속할 수 있습니다.

| 저장소 이름 | 배포 주소 |
|---|---|
| `<username>.github.io` | `https://<username>.github.io/` |
| 그 외 (예: `devlog`) | `https://<username>.github.io/devlog/` |

`site`(origin) 와 `base`(하위 경로)는 `actions/configure-pages` 가 알려주는 값으로 **자동 설정**되므로
`astro.config.ts` 를 수정할 필요가 없습니다. 커스텀 도메인을 연결해도 자동으로 반영됩니다.

로컬에서 같은 조건으로 빌드해 보려면 환경 변수를 지정합니다.

```bash
SITE=https://username.github.io BASE=/devlog npm run build
```

---

## 문제 해결

### WSL 의 `/mnt/c` 경로에서 build 시 `EPERM: operation not permitted, copyfile`

Windows 드라이브가 `uid=0`(root) 으로 마운트되어 있으면 Node.js 가 `public/` 파일을 `dist/` 로 복사할 때
권한 오류가 발생합니다. 둘 중 하나로 해결합니다.

1. 프로젝트를 WSL 리눅스 파일시스템(예: `~/projects/devlog`)으로 옮겨서 작업 (속도도 훨씬 빠름, 권장)
2. `/etc/wsl.conf` 에 아래 설정 후 PowerShell 에서 `wsl --shutdown` 으로 재시작

   ```ini
   [automount]
   options = "metadata,uid=1000,gid=1000,umask=022"
   ```

Windows PowerShell 에서 직접 `npm run build` 하는 경우나 GitHub Actions 에서는 발생하지 않습니다.
