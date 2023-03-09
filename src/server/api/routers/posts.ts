import { schema } from "~/libs/validation/posts";
import { createTRPCRouter, creatorProcedure } from "~/server/api/trpc";
import { BadRequestError } from "~/server/errors/httpException";
import { isEmpty } from "~/utils/assertion";

import type { Tag } from "@prisma/client";

export const postsRouter = createTRPCRouter({
  create: creatorProcedure
    .input(schema.create)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      return ctx.prisma.$transaction(async (tx) => {
        // 카테고리가 존재하는 경우 카테고리 아이디가 서버에 존재하는지 확인
        if (input.categoryId) {
          const exists_category = await ctx.prisma.postCategory.findUnique({
            where: {
              id: input.categoryId,
            },
          });

          if (!exists_category) {
            throw new BadRequestError("CategoryNotFound", {
              http: {
                instance: "[trpc]: postsRouter.create",
              },
            });
          }
        }

        let createdTags: Tag[] = [];
        // 카테고리가 존재하는 경우
        if (!isEmpty(input.tags)) {
          const tags = await Promise.all(
            input.tags.map(async (tag) => {
              // 카테고리 정보가 이미 존재하는지 체크
              const tagData = await tx.tag.findFirst({
                where: {
                  name: tag,
                },
              });
              // 없으면 새롭게 생성하고 있으면 기존 데이터를 사용
              if (!tagData) {
                return tx.tag.create({
                  data: {
                    name: tag,
                  },
                });
              }
              return tagData;
            })
          );
          createdTags = tags;
        }

        // 발행일시가 없는 경우 오늘로 설정
        const issueDate = input.issueDate ?? new Date();

        const post = await tx.post.create({
          data: {
            title: input.title,
            subTitle: input.subTitle,
            content: input.content,
            thumbnail: input.thumbnail,
            issueDate,
            published: input.published ?? false,
            userId: session.id,
          },
        });

        // 태그가 존재하는 경우에만 게시물과 태그를 연결
        if (!isEmpty(createdTags)) {
          await Promise.all(
            createdTags.map((tag) =>
              tx.postsTags.create({
                data: {
                  post: {
                    connect: {
                      id: post.id,
                    },
                  },
                  tag: {
                    connect: {
                      id: tag.id,
                    },
                  },
                },
              })
            )
          );
        }

        return {
          dataId: post.id,
        };
      });
    }),
});
