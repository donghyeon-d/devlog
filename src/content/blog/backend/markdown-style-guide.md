---
title: "Markdown 스타일 가이드"
description: "이 블로그에서 사용할 수 있는 Markdown 문법과 렌더링 결과를 한 페이지에서 확인합니다."
date: 2026-07-10
category: "Backend"
tags:
  - Markdown
  - Guide
draft: true
---

이 글은 `draft: true` 이므로 **개발 서버에서만** 보이고 production build 에서는 제외됩니다.

## Heading

### H3 제목

#### H4 제목

## 텍스트

**굵게**, *기울임*, ~~취소선~~, `inline code`, [링크](https://astro.build), <kbd>Ctrl</kbd> + <kbd>C</kbd>

## 코드 하이라이팅

```js
// JavaScript
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(sum(1, 2, 3));
```

```ts
// TypeScript
interface User {
  id: number;
  name: string;
}
const users: User[] = [{ id: 1, name: 'Kim' }];
```

```html
<!doctype html>
<html lang="ko">
  <body>
    <h1 class="title">Hello</h1>
  </body>
</html>
```

```css
.title {
  color: #2563eb;
  font-weight: 700;
}
```

```json
{ "name": "devlog", "private": true }
```

## Callout

> [!NOTE]
> 참고할 내용입니다.

> [!TIP]
> 알아두면 좋은 팁입니다.

> [!IMPORTANT]
> 중요한 내용입니다.

> [!WARNING]
> 주의해야 할 내용입니다.

> [!CAUTION]
> 위험할 수 있는 내용입니다.

> 일반 인용문입니다.

## Table

| Name | Description |
|---|---|
| MySQL | Database |
| Redis | Cache |

## List

- 순서 없는 목록
  - 중첩 목록
- 두 번째 항목

1. 순서 있는 목록
2. 두 번째

- [x] 완료한 작업
- [ ] 남은 작업

---

각주도 사용할 수 있습니다.[^1]

[^1]: 각주 내용입니다.
