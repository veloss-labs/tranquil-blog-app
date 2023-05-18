import React from 'react';
import Category from './Category';
import { getTags } from '~/server/data/getTags';

export default async function Categories() {
  const tags = await getTags();

  const categories = tags.map((tag) => {
    return {
      name: tag.name,
      slug: tag.slug,
      to: `/?tag=${tag.slug}`,
    };
  });

  return (
    <>
      <Category key={`Category-all`} name={'All'} slug={null} to={'/'} />
      {categories.map((category) => (
        <Category
          key={`Category-${category.name}`}
          name={category.name}
          slug={category.slug}
          to={category.to}
        />
      ))}
    </>
  );
}
