import React from 'react';
import Tags from './Tags';
import { getTags } from '~/server/data/getTags';

export default async function AsyncTags() {
  const tags = await getTags();
  return <Tags tags={tags} />;
}
