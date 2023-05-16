import type { PostSchema, CoverType, TagSchema } from '~/ts/schema';

export const PROPERTIES = {
  TITLE: '페이지',
  TAGS: '태그',
  DESCRIPTION: '짧은 소개',
  CREATED_AT: '생성 일시',
  UPDATED_AT: '최종 편집 일시',
} as const;

export const TAG_PROPERTIES = {
  NAME: '이름',
  SLUG: 'slug',
  MEDIA: '미디어',
} as const;

export function serialize<C extends CoverType>(item: any): PostSchema<C> {
  const properties: Record<string, any> = item.properties ?? {};
  const block = item.parent ?? null;
  return {
    id: item.id,
    title: properties[PROPERTIES.TITLE].title?.at(0)?.plain_text,
    tags: properties[PROPERTIES.TAGS].relation ?? [],
    description:
      properties[PROPERTIES.DESCRIPTION].rich_text?.at(0)?.plain_text,
    createdAt: properties[PROPERTIES.CREATED_AT].created_time,
    updatedAt: properties[PROPERTIES.UPDATED_AT].last_edited_time,
    cover: item.cover,
    block,
  };
}

export function serializeForTag(item: any): TagSchema {
  const properties: Record<string, any> = item.properties ?? {};
  const block = item.parent ?? null;
  return {
    id: item.id,
    name: properties[TAG_PROPERTIES.NAME].rich_text?.at(0)?.text?.content,
    slug: properties[TAG_PROPERTIES.SLUG].title?.at(0)?.plain_text,
    media: properties[TAG_PROPERTIES.MEDIA].files ?? [],
    block,
  };
}
