'use client';
import React from 'react';
import Tag from './Tag';
import { TagSchema } from '~/ts/schema';

interface TagsProps {
  tags: TagSchema[];
}

export default function Tags({ tags }: TagsProps) {
  return (
    <>
      <Tag key={`Tag-all`} name={'All'} slug={null} />
      {tags.map((tag) => (
        <Tag key={`Tag-${tag.name}`} name={tag.name} slug={tag.slug} />
      ))}
    </>
  );
}
