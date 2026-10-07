import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 블로그 글 컬렉션
 *
 * src/content/blog/<폴더>/<파일명>.md 가 /blog/<폴더>/<파일명> 으로 생성된다.
 * 파일명이 `_` 로 시작하면 무시된다. (임시 메모 등에 사용)
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1, 'title 은 비어 있을 수 없습니다.'),
    description: z.string().min(1, 'description 은 비어 있을 수 없습니다.'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().min(1, 'category 는 비어 있을 수 없습니다.'),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
