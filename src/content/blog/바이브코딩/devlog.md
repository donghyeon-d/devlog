---
# 글 제목. <title>, og:title 에 사용된다.
title: "커스텀 블로그"
# 한두 문장 요약. 목록, meta description, og:description 에 사용된다.
description: "딸깍으로 블로그를 만들었습니다. 왜 만들었고 어떻게 만들게 됐는지 정리해봤습니다."
# 작성일 (YYYY-MM-DD)
date: 2026-10-07
category: "바이브코딩"
tags:
  - 바이브코딩
  - 블로그
draft: false
---

> 블로그를 왜 만들었고 어떻게 만들게 되었는지에 대해서 정리해봅니다. 개발지식이 있으신 분들이라면 이 정도 블로그는 매우 쉽게 제작할 수 있을거라고 생각됩니다. 그래도 시작하기 막막하신 분들께 참고 자료가 될 수 있을 것이라는 기대로 기록해봅니다.

## 왜 커스텀 블로그를 만들게 되었는지

### 기록

- 기록에 대한 시도는 계속 있었다. 처음 개발 공부를 할 때는 Notion 을 이용했는데, 내용이 많아지다보니 페이지의 뎁스가 계속 깊어졌다. 카테고리화, 검색, 태깅 등이 잘 되는 방향으로 블로그를 구성하고 싶었다.
- 티스토리로도 시도했었는데 페이지 커스텀이 생각보다 쉽지 않았다. 웹프론트 개발자가 아닌 나에게는 추가로 학습해야할 것들이 꽤 많았다. 학습을 미루다보니 기록도 미루게 되었다.

### 편의성

- md 파일로 작성하고 싶었다. 제목, 목차, 머릿글, 볼드체, 표 등을 키보드 입력으로 다 됐다. 쓰다보니 꽤 편한게 md 파일이다.

### 커스텀

- 디자인/레이아웃은 커스텀하고 싶었다. 예전에 Jekyll 사용을 시도해봤던 경험이 있는데, ai 의 도움을 받으면 내가 원하는대로 완전히 커스텀될 수 있을 것 같았다.

## 블로그 생성 과정

### 프롬프트 제작

- 클로드에게 프롬프트를 짜달라고 했다. 어떤 스킬로 구성하든 깊게 사용해야되는 상황이 오면 추가로 학습해야되기 때문에, 그냥 gpt 가 추천하는대로 받았다.

```
[요청]
개발 블로그를 만들고 싶어. 프로젝트 코드를 ai 에이전트한테 만들게 할건데 프롬프트 만들어줘.
디자인은 하얀 배경에 파란색 요소들을 사용해서 밝고 신뢰성 있는 느낌을 주면 좋겠어.
md 파일로 작업해서 프로젝트 안에 위치시키면 그것을 읽어서 html 로 변환해서 보여주는 식이면 좋겠어.
```

````
[응답]
개발자를 위한 개인 기술 블로그 프로젝트를 만들어줘.

단순한 샘플이 아니라 실제로 계속 글을 작성하고 운영할 수 있는 수준으로 프로젝트 전체를 구현해줘.

## 1. 프로젝트 목표

Markdown 파일을 프로젝트 내부에 작성하면 이를 읽어서 정적 HTML 페이지로 생성하는 개발 블로그를 만든다.

블로그 글 작성자는 HTML을 직접 작성하지 않고 Markdown 파일만 추가하면 된다.

예를 들어 다음과 같은 구조로 글을 관리하고 싶다.

```text
src/
  content/
    blog/
      linux/
        wsl-keep-alive.md
      database/
        mysql-cast-int.md
      flutter/
        go-router.md
```

Markdown 파일을 추가하고 프로젝트를 빌드하면 자동으로 다음과 같은 URL로 접근할 수 있어야 한다.

```text
/blog/linux/wsl-keep-alive
/blog/database/mysql-cast-int
/blog/flutter/go-router
```

정적 사이트 생성 방식으로 구현하고 SEO와 페이지 로딩 속도를 중요하게 고려해줘.

---

## 2. 기술 스택

다음 기술을 기본으로 사용해줘.

- Astro
- TypeScript
- Markdown
- Astro Content Collections
- CSS 또는 필요한 경우 최소한의 CSS 프레임워크
- Shiki를 이용한 코드 syntax highlighting
- 정적 사이트 생성(SSG)

React, Vue 등의 UI 프레임워크는 꼭 필요한 경우가 아니면 사용하지 않는다.

JavaScript 사용을 최소화하고 기본적으로 서버에서 생성된 정적 HTML을 제공하도록 구현한다.

---

## 3. 디자인 방향

전체 디자인은 다음 컨셉으로 만들어줘.

- 밝은 개발 문서 / 기술 블로그 느낌
- 흰색 배경
- 파란색을 메인 포인트 컬러로 사용
- 깔끔하고 신뢰감 있는 디자인
- 과도한 애니메이션이나 장식은 사용하지 않는다.
- 개발자가 오래 읽어도 피로하지 않은 UI
- GitHub, Vercel, Stripe Documentation 같은 깔끔한 개발자 문서 사이트의 느낌을 참고하되 그대로 복제하지 않는다.

대략적인 컬러 느낌:

```text
Background: #FFFFFF
Sub Background: #F8FAFC

Primary Blue: #2563EB
Primary Hover: #1D4ED8
Light Blue: #EFF6FF

Main Text: #0F172A
Secondary Text: #64748B
Border: #E2E8F0
```

적절한 border-radius와 매우 약한 shadow 정도는 사용할 수 있다.

폰트는 한국어와 영어 개발 문서를 읽기 편한 형태로 구성한다.

---

## 4. 전체 레이아웃

PC에서는 다음 구조를 기본으로 한다.

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
│ Logo / Blog Name            Search / GitHub │
├───────────┬──────────────────────────────────┤
│           │                                  │
│ Sidebar   │          Main Content            │
│           │                                  │
│ Category  │       Blog Article / List        │
│ Tags      │                                  │
│           │                                  │
└───────────┴──────────────────────────────────┘
```

모바일에서는 sidebar가 사라지거나 메뉴 버튼으로 열리도록 responsive하게 구현한다.

본문 최대 너비를 제한해서 긴 문장이 지나치게 넓게 표시되지 않도록 한다.

---

## 5. Header

Header에는 다음 요소가 있다.

왼쪽:

- 블로그 이름
- 클릭하면 `/` 이동

오른쪽:

- 글 검색
- GitHub 링크
- 필요하다면 About

Header는 스크롤해도 상단에 유지되는 sticky 형태로 구현한다.

너무 높지 않게 한다.

---

## 6. 메인 페이지

`/` 페이지에는 다음 내용을 보여준다.

상단 Hero 영역:

```text
안녕하세요.
개발하면서 공부하고 경험한 내용을 기록합니다.

Backend · Database · Linux · Flutter · DevOps
```

그 아래에는:

- 최근 작성 글
- 카테고리
- 인기 태그 또는 주요 태그

를 표시한다.

최근 글에는 다음 정보를 보여준다.

- 제목
- 짧은 description
- 작성 날짜
- 수정 날짜가 있다면 수정 날짜
- 카테고리
- 태그
- 읽는 데 걸리는 예상 시간

디자인은 카드가 지나치게 강조되지 않도록 한다.

문서 목록에 가까운 깔끔한 디자인을 선호한다.

---

## 7. Markdown Frontmatter

각 Markdown 글은 다음 형식을 사용한다.

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

필수 필드:

```text
title
description
date
category
tags
```

선택 필드:

```text
updated
draft
```

`draft: true`인 글은 production build에서 노출하지 않는다.

Frontmatter 스키마를 Astro Content Collections를 이용해서 타입 검증하도록 구현한다.

---

## 8. 글 상세 페이지

Markdown 글 페이지에는 다음 요소가 필요하다.

상단:

- 제목
- description
- 작성 날짜
- 수정 날짜
- category
- tags
- 예상 읽기 시간

본문:

- Markdown 렌더링
- H1 ~ H4 스타일
- 코드 블록
- inline code
- blockquote
- table
- ul / ol
- 링크
- 이미지
- horizontal rule

코드 블록은 개발 블로그에서 가장 중요한 요소 중 하나이므로 읽기 쉽게 구현한다.

다음 언어의 syntax highlighting이 자연스럽게 보여야 한다.

- PHP
- Java
- JavaScript
- TypeScript
- Dart
- SQL
- Bash
- JSON
- YAML
- HTML
- CSS

코드 블록에는 가능하면 Copy 버튼도 제공한다.

---

## 9. 목차(Table of Contents)

글에 H2/H3 제목이 존재하면 자동으로 목차를 생성한다.

PC 화면에서는 본문 오른쪽에 sticky TOC를 표시한다.

예:

```text
On this page

1. MySQL CAST란?
2. INT 변환
   2.1 CAST
   2.2 CONVERT
3. 주의사항
```

현재 읽고 있는 section을 표시할 수 있으면 구현한다.

모바일에서는 TOC를 접거나 본문 상단에서 볼 수 있도록 한다.

---

## 10. 카테고리

카테고리를 지원한다.

예:

```text
Backend
Database
Linux
Flutter
DevOps
Troubleshooting
```

다음 URL을 지원한다.

```text
/categories
/categories/database
/categories/linux
```

각 카테고리 페이지에서는 해당 카테고리의 글 목록을 최신순으로 표시한다.

카테고리는 Markdown frontmatter에서 자동으로 수집한다.

별도의 카테고리 설정 파일을 매번 수정할 필요가 없도록 한다.

---

## 11. 태그

태그 기능을 구현한다.

예:

```text
MySQL
BigQuery
Linux
WSL
Flutter
PHP
Spring
```

URL:

```text
/tags
/tags/mysql
/tags/flutter
```

태그 이름과 해당 태그의 글 개수를 보여준다.

---

## 12. 검색

블로그 글 검색 기능을 구현한다.

검색 대상:

- title
- description
- category
- tags
- 가능하다면 article content

정적 사이트의 장점을 해치지 않는 방식으로 구현한다.

가능하면 Pagefind 같은 정적 사이트 검색 방식을 사용한다.

검색 서버나 별도의 DB가 필요하지 않아야 한다.

---

## 13. 이전 글 / 다음 글

글 하단에 같은 블로그의 이전 글과 다음 글 링크를 제공한다.

예:

```text
← 이전 글
WSL 자동 종료 방지하기

다음 글 →
MySQL CAST 사용법
```

---

## 14. 관련 글

현재 글과 category 또는 tags가 겹치는 글 중 최대 3개를 관련 글로 표시한다.

---

## 15. SEO

각 Markdown 글의 frontmatter를 이용해서 자동으로 다음 SEO 정보를 생성한다.

- title
- meta description
- canonical
- Open Graph
- Twitter Card

추가로 다음을 구현한다.

```text
sitemap.xml
robots.txt
RSS
```

Article structured data(JSON-LD)를 추가할 수 있으면 구현한다.

---

## 16. URL slug

파일 경로를 기본 slug로 사용한다.

예:

```text
src/content/blog/linux/wsl-keep-alive.md
```

↓

```text
/blog/linux/wsl-keep-alive
```

URL에 `.html`이나 `.md`는 표시하지 않는다.

---

## 17. Markdown 기능

일반 Markdown 외에 개발 블로그에서 유용한 기능을 지원한다.

GitHub Flavored Markdown을 지원해서 다음이 동작하도록 한다.

- table
- task list
- strikethrough

예:

```md
| Name  | Description |
| ----- | ----------- |
| MySQL | Database    |
| Redis | Cache       |
```

Callout 기능도 사용할 수 있으면 좋다.

예:

```md
> [!NOTE]
> 참고할 내용입니다.

> [!WARNING]
> 주의해야 할 내용입니다.
```

---

## 18. 이미지

Markdown에서 다음과 같이 이미지를 사용할 수 있게 한다.

```md
![설명](/images/posts/mysql/example.png)
```

이미지 파일은 다음처럼 관리할 수 있게 한다.

```text
public/
  images/
    posts/
      mysql/
        example.png
```

가능하면 이미지 최적화도 고려한다.

---

## 19. 404

깔끔한 404 페이지를 만든다.

내용:

```text
404

페이지를 찾을 수 없습니다.

홈으로 돌아가기
```

전체 블로그 디자인과 동일한 스타일을 사용한다.

---

## 20. 디렉토리 구조

유지보수하기 좋은 구조로 만들어줘.

예를 들면:

```text
src/
├── components/
│   ├── Header.astro
│   ├── Sidebar.astro
│   ├── PostCard.astro
│   ├── TableOfContents.astro
│   ├── Tag.astro
│   └── Footer.astro
│
├── content/
│   └── blog/
│       └── ...
│
├── layouts/
│   ├── BaseLayout.astro
│   └── BlogPostLayout.astro
│
├── pages/
│   ├── index.astro
│   ├── blog/
│   ├── categories/
│   └── tags/
│
├── styles/
│   └── global.css
│
└── content.config.ts
```

실제 Astro 최신 권장 구조에 맞지 않는 부분이 있다면 최신 권장 구조를 우선해서 수정해도 된다.

---

## 21. 샘플 글

기능 확인을 위해 Markdown 샘플 글을 최소 3개 만들어줘.

예:

```text
Linux
MySQL
Flutter
```

특히 샘플 글에는 다음을 포함해서 Markdown 스타일을 테스트할 수 있게 한다.

- headings
- paragraphs
- code block
- inline code
- table
- list
- blockquote
- link
- callout

---

## 22. README

README.md도 작성한다.

README에는 최소한 다음 내용을 설명한다.

### 개발 서버 실행

```bash
npm install
npm run dev
```

### production build

```bash
npm run build
```

### production 미리보기

```bash
npm run preview
```

### 새 글 작성 방법

어느 디렉토리에 Markdown 파일을 생성해야 하는지 설명한다.

예:

```text
src/content/blog/linux/my-new-post.md
```

그리고 사용할 frontmatter 예제를 제공한다.

### 배포

GitHub Pages에 배포할 수 있도록 설명한다.

가능하면 GitHub Actions를 이용해

```text
git push
→ GitHub Actions
→ Astro build
→ GitHub Pages deploy
```

가 자동으로 이루어지도록 workflow도 만들어줘.

---

## 23. 품질 기준

구현할 때 다음을 중요하게 생각한다.

- 모바일 반응형
- 접근성
- semantic HTML
- SEO
- 빠른 페이지 로딩
- 최소한의 JavaScript
- 재사용 가능한 component
- 유지보수하기 쉬운 코드
- TypeScript 타입 안정성
- Markdown 글 작성 편의성

불필요하게 복잡한 라이브러리를 설치하지 않는다.

---

## 24. 작업 방법

먼저 현재 프로젝트 디렉토리를 확인한다.

프로젝트가 없다면 Astro 프로젝트를 생성한다.

그 다음 필요한 dependency를 설치하고 전체 구조를 구현한다.

파일을 하나씩 나열해서 설명만 하지 말고 실제 프로젝트 파일을 생성하고 수정해라.

구현이 끝나면 반드시 다음을 실행해서 오류가 없는지 확인한다.

```bash
npm install
npm run build
```

빌드 에러가 발생하면 원인을 찾아 수정해서 최종적으로 build가 성공하도록 한다.

마지막으로 다음 내용을 간단히 정리한다.

1. 생성한 주요 기능
2. 프로젝트 구조
3. 새 Markdown 글 작성 방법
4. 로컬 실행 방법
5. GitHub Pages 배포 방법

디자인은 기능 구현 후 끝내지 말고 실제 사용할 수 있는 완성도 있는 개발 블로그처럼 CSS까지 세심하게 구현해줘.

````

### 사용한 기술들의 용도

- **Astro**: 개발 블로그 같은 정적 사이트를 만들기 위한 프레임워크입니다. Markdown 글을 HTML 페이지로 바꾸는 데 아주 잘 맞습니다. 이건 꽤 추천합니다.
- **TypeScript**: JavaScript에 타입 검사를 추가한 언어입니다. 블로그 규모라면 필수는 아닙니다. AI가 코드를 만들 거라면 있어도 괜찮지만, 직접 유지보수할 때 복잡하게 느껴질 수 있습니다.
- **Astro Content Collections**: Markdown 글의 제목, 날짜, 태그 같은 정보를 Astro가 체계적으로 관리해주는 기능입니다. 없어도 구현 가능하지만 글이 많아지면 편합니다.
- **Shiki**: Markdown 안의 코드 블록을 PHP, SQL, Bash 같은 언어별로 예쁘게 색칠해주는 도구입니다. 개발 블로그라면 있으면 좋지만 꼭 직접 설정할 필요는 없습니다. Astro 쪽에서 자연스럽게 붙여 사용할 수 있습니다.

### 프로젝트 생성 및 클로드 코드로 제작

- 프로젝트를 생성하고 위에서 나온 프롬프트를 그대로 입력해서 코드를 제작했다.
- 제작된 README.md 와 프로젝트의 구조를 살펴보면서 어떻게 사용하면 되는지에 대해서 파악했다.

## 활용

- 앞으로 이 블로그에 이런 저런 글들을 작성해보려한다. 운영하다보면 커스텀이 또 필요한 부분이 생길수도 있을 것 같은데, 그때 추가로 해보려 한다.
