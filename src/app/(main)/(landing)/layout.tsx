import React from 'react';
import Category from '~/components/blog/Category';
import { api } from '~/libs/api/server';

interface LayoutProps {
  children: React.JSX.Element;
}

export default async function Layout({ children }: LayoutProps) {
  const { tags } = await api.tags.list.fetch();

  const categories = tags.map((tag) => {
    return {
      name: tag.name,
      slug: tag.slug,
      to: `/?tag=${tag.slug}`,
    };
  });

  return (
    <main className="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 className="text-5xl font-display font-bold">Blog</h1>
      <div className="flow-root mt-8 text-sm text-gray-400">
        <div className="-m-4 flex flex-row flex-wrap">
          <Category key={`Category-all`} name={'All'} slug={null} to={'/'} />
          {categories.map((category) => (
            <Category
              key={`Category-${category.name}`}
              name={category.name}
              slug={category.slug}
              to={category.to}
            />
          ))}
        </div>
      </div>
      {children}
    </main>
  );
}
