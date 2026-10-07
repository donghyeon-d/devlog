/**
 * 사이트 전역 설정
 *
 * 블로그 이름, 작성자, GitHub 주소 등은 여기만 수정하면 된다.
 */
export const SITE = {
  /** Header 와 <title> 에 사용되는 블로그 이름 */
  title: 'devlog',
  /** 메타 설명 / RSS 설명 */
  description: '개발하면서 공부하고 경험한 내용을 기록하는 기술 블로그입니다.',
  author: 'Dongchoi',
  /** <html lang> 과 og:locale */
  lang: 'ko',
  locale: 'ko_KR',
  /** Header 의 GitHub 링크 (비워두면 숨김) */
  github: 'https://github.com/donghyeon-d',
  /** 메인 Hero 영역 */
  hero: {
    greeting: '안녕하세요.',
    intro: '개발하면서 공부하고 경험한 내용을 기록합니다.',
    topics: ['Backend', 'Database', 'Linux', 'Flutter', 'DevOps'],
  },
  /** 메인 페이지에 보여줄 최근 글 개수 */
  recentPostCount: 8,
  /** 기본 Open Graph 이미지 (public/ 기준) */
  ogImage: '/og-default.png',
} as const;
