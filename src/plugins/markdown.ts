/**
 * Markdown(HAST) 후처리 플러그인 모음.
 *
 * Astro 7 의 기본 Markdown 프로세서인 Sätteri 위에서 동작한다.
 * Shiki 하이라이팅 이후, heading id 생성 이전에 실행된다.
 */
import { defineHastPlugin, type HastPluginList } from 'satteri';
import type { Element, ElementContent, Properties } from 'hast';

const CALLOUT_TITLES = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
} as const;

type CalloutType = keyof typeof CALLOUT_TITLES;

const CALLOUT_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\r?\n)?/i;

/** 매우 작은 HAST 생성 헬퍼 */
function h(tagName: string, properties: Properties, children: ElementContent[] = []): Element {
  return { type: 'element', tagName, properties, children };
}

function text(value: string): ElementContent {
  return { type: 'text', value };
}

/** 플러그인이 받은 노드는 읽기 전용이므로 새 트리에 넣기 전에 복사한다. */
function clone<T>(node: T): T {
  return structuredClone(node);
}

function isBlank(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/**
 * 본문 맨 앞의 H1 제거
 *
 * frontmatter 의 title 이 페이지 H1 으로 렌더링되므로, 본문이 `# 제목` 으로
 * 시작하면 H1 이 중복된다. (문서 내 H1 은 하나만 두는 것이 SEO/접근성에 좋다)
 */
const removeLeadingH1 = defineHastPlugin({
  name: 'devlog-remove-leading-h1',
  element: {
    filter: ['h1'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      if (!parent || parent.type !== 'root') return;
      const index = ctx.indexOf(node) ?? 0;
      const before = parent.children.slice(0, index);
      if (before.every((child) => child.type === 'text' && !child.value.trim())) {
        ctx.removeNode(node);
      }
    },
  },
});

/**
 * GitHub 스타일 callout
 *
 * > [!NOTE]
 * > 내용
 */
const callout = defineHastPlugin({
  name: 'devlog-callout',
  element: {
    filter: ['blockquote'],
    visit(node, ctx) {
      const children = node.children.filter((child) => !isBlank(child));
      const first = children[0];
      if (!first || first.type !== 'element' || first.tagName !== 'p') return;

      const lead = first.children[0];
      if (!lead || lead.type !== 'text') return;

      const match = lead.value.match(CALLOUT_PATTERN);
      if (!match) return;

      const type = match[1].toLowerCase() as CalloutType;
      const rest = lead.value.slice(match[0].length);
      const firstParagraph = [...(rest ? [text(rest)] : []), ...first.children.slice(1).map(clone)];
      const body = [
        ...(firstParagraph.length ? [h('p', {}, firstParagraph)] : []),
        ...children.slice(1).map(clone),
      ];

      ctx.replaceNode(
        node,
        h('aside', { className: ['callout', `callout-${type}`], role: 'note' }, [
          h('p', { className: ['callout-title'] }, [
            h('span', { className: ['callout-icon'], ariaHidden: 'true' }),
            text(CALLOUT_TITLES[type]),
          ]),
          h('div', { className: ['callout-body'] }, body),
        ]),
      );
    },
  },
});

const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  console: 'Console',
  powershell: 'PowerShell',
  php: 'PHP',
  java: 'Java',
  kotlin: 'Kotlin',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  dart: 'Dart',
  sql: 'SQL',
  mysql: 'MySQL',
  json: 'JSON',
  jsonc: 'JSONC',
  yaml: 'YAML',
  yml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  xml: 'XML',
  ini: 'INI',
  toml: 'TOML',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
  python: 'Python',
  py: 'Python',
  go: 'Go',
  rust: 'Rust',
  diff: 'Diff',
  md: 'Markdown',
  markdown: 'Markdown',
  nginx: 'Nginx',
  plaintext: 'Text',
  text: 'Text',
  txt: 'Text',
};

/**
 * 코드 블록을 감싸서 언어 라벨과 복사 버튼을 추가한다.
 * 버튼 동작은 BlogPostLayout 의 작은 스크립트가 담당한다.
 */
const codeBlock = defineHastPlugin({
  name: 'devlog-code-block',
  element: {
    filter: ['pre'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      if (parent && parent.type === 'element' && parent.properties?.className?.toString().includes('code-block')) {
        return;
      }
      const rawLang = node.properties?.dataLanguage;
      const lang = typeof rawLang === 'string' ? rawLang : 'plaintext';
      const label = LANGUAGE_LABELS[lang.toLowerCase()] ?? lang;

      ctx.replaceNode(
        node,
        h('div', { className: ['code-block'], dataLanguage: lang }, [
          h('div', { className: ['code-block-header'], dataPagefindIgnore: '' }, [
            h('span', { className: ['code-block-lang'] }, [text(label)]),
            h(
              'button',
              { type: 'button', className: ['code-copy'], ariaLabel: '코드 복사', dataCopy: '' },
              [text('Copy')],
            ),
          ]),
          // Shiki 가 pre 에 tabindex="0" 을 붙여 가로 스크롤 영역을 키보드로 접근할 수 있다.
          clone(node) as Element,
        ]),
      );
    },
  },
});

/** 넓은 표가 모바일에서 레이아웃을 깨지 않도록 스크롤 영역으로 감싼다. */
const tableWrapper = defineHastPlugin({
  name: 'devlog-table-wrapper',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, h('div', { className: ['table-wrapper'], tabIndex: 0 }));
    },
  },
});

/**
 * `/images/...`, `/blog/...` 처럼 `/` 로 시작하는 경로에 base 를 붙인다.
 * GitHub Pages 프로젝트 페이지(/repo-name)에 배포해도 Markdown 의 링크/이미지가 깨지지 않는다.
 */
function prefixBase(path: string, base: string): string {
  if (!base || !path.startsWith('/') || path.startsWith('//') || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

/** public/ 이미지에 base 경로와 lazy loading 을 적용한다. */
function images(base: string) {
  return defineHastPlugin({
    name: 'devlog-images',
    element: {
      filter: ['img'],
      visit(node, ctx) {
        const src = node.properties?.src;
        if (typeof src === 'string') ctx.setProperty(node, 'src', prefixBase(src, base));
        if (!node.properties?.loading) ctx.setProperty(node, 'loading', 'lazy');
        if (!node.properties?.decoding) ctx.setProperty(node, 'decoding', 'async');
      },
    },
  });
}

/** 내부 절대 경로 링크에는 base 를, 외부 링크에는 새 탭 + noopener 를 적용한다. */
function links(base: string) {
  return defineHastPlugin({
    name: 'devlog-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string') return;
        if (/^https?:\/\//.test(href)) {
          ctx.setProperty(node, 'target', '_blank');
          ctx.setProperty(node, 'rel', 'noopener noreferrer');
        } else {
          ctx.setProperty(node, 'href', prefixBase(href, base));
        }
      },
    },
  });
}

/**
 * @param base astro.config 의 base (예: '/devlog'). 루트 배포면 '/' 또는 ''.
 */
export function markdownPlugins(base = '/'): HastPluginList {
  const normalizedBase = base.replace(/\/+$/, '');
  return [
    removeLeadingH1,
    callout,
    codeBlock,
    tableWrapper,
    images(normalizedBase),
    links(normalizedBase),
  ];
}
