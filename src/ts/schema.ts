export type TagSchema = {
  id: string;
  name: string;
  slug: string;
  media: any[];
  block: BlockSchema;
};

export type BlockSchema = {
  type: string;
  block_id: string;
};

export type ExternalCoverSchema = {
  url: string;
};

export type CoverType = 'external' | 'internal';

export type CoverSchema<type extends CoverType> = {
  type: type;
} & (type extends 'external' ? ExternalCoverSchema : Record<string, any>);

export type PostSchema<C extends CoverType> = {
  id: string;
  title: string;
  tags: Pick<TagSchema, 'id'>[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  cover: CoverSchema<C>;
  block: BlockSchema;
};

export type UnionPostSchema = Omit<PostSchema<CoverType>, 'tags'> & {
  tags: TagSchema[];
};
