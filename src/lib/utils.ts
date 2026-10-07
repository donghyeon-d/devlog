/**
 * base 경로(GitHub Pages 프로젝트 페이지의 /repo-name 등)를 붙인 내부 링크를 만든다.
 * 모든 내부 링크는 이 함수를 거쳐야 배포 경로가 바뀌어도 깨지지 않는다.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:)?\/\//.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `${base}/`;
  return `${base}${normalized}`;
}

/**
 * 카테고리/태그 이름을 URL slug 로 변환한다.
 * 한글은 그대로 유지하고, 공백은 하이픈으로 바꾼다.
 *
 * "Database" → "database", "Spring Boot" → "spring-boot", "C++" → "cpp", "C#" → "csharp"
 */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/#/g, 'sharp')
    .replace(/[\s_/.]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
});

/** 2026-09-16 → "2026. 09. 16." */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** <time datetime> 용 YYYY-MM-DD */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * 예상 읽기 시간(분)
 *
 * 한글은 글자 수(분당 약 500자), 영어/코드는 단어 수(분당 약 200단어) 기준으로 계산한다.
 */
export function readingTime(markdown: string): number {
  const plain = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ');

  const hangul = (plain.match(/[ㄱ-힝]/g) ?? []).length;
  const words = plain
    .replace(/[ㄱ-힝]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(hangul / 500 + words / 200));
}
