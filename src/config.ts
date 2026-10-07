/**
 * 사이트 전역 설정
 *
 * 블로그 이름, 작성자, GitHub 주소 등은 여기만 수정하면 된다.
 */
export const SITE = {
  /** Header 와 <title> 에 사용되는 블로그 이름 */
  title: "devlog",
  /** 메타 설명 / RSS 설명 */
  description: "DongChoi's",
  author: "Dongchoi",
  /** <html lang> 과 og:locale */
  lang: "ko",
  locale: "ko_KR",
  /** Header 의 GitHub 링크 (비워두면 숨김) */
  github: "https://github.com/donghyeon-d",
  /** 메인 Hero 영역 */
  hero: {
    greeting: "Dongchoi's",
    intro: "개발하며 경험한 내용을 기록합니다",
    topics: ["Game Server", "Backend"],
  },
  /** 메인 페이지에 보여줄 최근 글 개수 */
  recentPostCount: 8,
  /** 기본 Open Graph 이미지 (public/ 기준) */
  ogImage: "/og-default.png",
} as const;
