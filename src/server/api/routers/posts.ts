import isEqual from "lodash-es/isEqual";
import { schema } from "~/libs/validation/posts";
import {
  createTRPCRouter,
  creatorProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "~/server/errors/httpException";
import { isEmpty } from "~/utils/assertion";
import { getTrpcRouterCookie } from "~/server/auth";
import { Prisma, type Tag } from "@prisma/client";
import { responseWith } from "~/server/utils/response";
import { RESULT_CODE } from "~/server/errors/code";

const _default_post_select = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  subTitle: true,
  content: true,
  viewCount: true,
  issueDate: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  thumbnail: {
    select: {
      id: true,
      url: true,
    },
  },
  user: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          profileUrl: true,
          username: true,
          bio: true,
          website: true,
          location: true,
        },
      },
    },
  },
  postsTags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
});

export const postsRouter = createTRPCRouter({
  byId: publicProcedure.input(schema.byId).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.id,
      },
      select: _default_post_select,
    });

    if (!post) {
      throw new BadRequestError("PostNotFound", {
        http: {
          instance: "[trpc]: postsRouter.byId",
          extra: responseWith({
            ok: false,
            resultCode: RESULT_CODE.NOT_FOUND,
            resultMessage: "게시글이 존재하지 않습니다.",
          }),
        },
      });
    }
    return responseWith({
      data: post,
    });
  }),
  create: creatorProcedure
    .input(schema.create)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      return ctx.prisma.$transaction(async (tx) => {
        // 발행일시가 없는 경우 오늘로 설정
        const issueDate = input.issueDate ?? new Date();

        const post = await tx.post.create({
          data: {
            title: input.title,
            subTitle: input.subTitle,
            content: input.content,
            issueDate,
            published: input.published ?? false,
            userId: session.id,
          },
        });

        // 카테고리가 존재하는 경우 카테고리와 게시물을 연결
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
                extra: responseWith({
                  ok: false,
                  resultCode: RESULT_CODE.NOT_FOUND,
                  resultMessage: "카테고리가 존재하지 않습니다.",
                }),
              },
            });
          }
        }

        // 썸네일이 존재하는 경우 썸네일과 게시물을 연결
        if (input.thumbnailId) {
          const exists_image = await ctx.prisma.postImage.findUnique({
            where: {
              id: input.thumbnailId,
            },
          });

          if (!exists_image) {
            throw new BadRequestError("PostImageNotFound", {
              http: {
                instance: "[trpc]: postsRouter.create",
                extra: responseWith({
                  ok: false,
                  resultCode: RESULT_CODE.NOT_FOUND,
                  resultMessage: "게시물 이미지가 존재하지 않습니다.",
                }),
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

        await tx.post.update({
          where: {
            id: post.id,
          },
          data: {
            categoryId: input.categoryId ? input.categoryId : null,
            thumbnailId: input.thumbnailId ? input.thumbnailId : null,
          },
        });

        return responseWith({
          data: post.id,
        });
      });
    }),
  update: creatorProcedure.input(schema.update).mutation(({ ctx, input }) => {
    const session = ctx.session;
    return ctx.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: {
          id: input.id,
        },
        select: _default_post_select,
      });

      if (!post) {
        throw new BadRequestError("PostNotFound", {
          http: {
            instance: "[trpc]: postsRouter.update",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "게시글이 존재하지 않습니다.",
            }),
          },
        });
      }

      if (post.user.id !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: postsRouter.update",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
          },
        });
      }

      const newData = {} as Prisma.XOR<
        Prisma.PostUpdateInput,
        Prisma.PostUncheckedUpdateInput
      >;
      if (input.title && !isEqual(input.title, post.title)) {
        newData.title = input.title;
      }
      if (input.subTitle && !isEqual(input.subTitle, post.subTitle)) {
        newData.subTitle = input.subTitle;
      }
      if (input.content && !isEqual(input.content, post.content)) {
        newData.content = input.content;
      }
      if (
        input.thumbnailId &&
        !isEqual(input.thumbnailId, post.thumbnail?.id)
      ) {
        newData.thumbnailId = input.thumbnailId;
      }
      if (input.issueDate) {
        const issueDate = input.issueDate.getTime();
        const postIssueDate = post.issueDate.getTime();
        if (!isEqual(issueDate, postIssueDate)) {
          newData.issueDate = new Date(issueDate);
        }
      }
      if (input.published !== undefined) {
        newData.published = input.published ?? false;
      }
      if (input.categoryId && !isEqual(input.categoryId, post.category?.id)) {
        newData.categoryId = input.categoryId;
      }
      const next_post_tags = input.tags ?? [];
      const current_post_tags = post.postsTags?.map((tag) => tag.tag) ?? [];
      if (
        next_post_tags &&
        next_post_tags.length > 0 &&
        !isEqual(
          input.tags,
          current_post_tags.map((tag) => tag.name)
        )
      ) {
        // 기존 태그와 새로운 태그를 비교하여 삭제할 태그와 추가할 태그를 구분
        const deleted_tags = current_post_tags.filter(
          (tag) => !next_post_tags.includes(tag.name)
        );
        const added_tags = next_post_tags.filter(
          (tag) => !current_post_tags.map((tag) => tag.name).includes(tag)
        );

        // 삭제할 태그가 존재하는 경우
        if (deleted_tags.length > 0) {
          await Promise.all(
            deleted_tags.map((tag) =>
              tx.postsTags.delete({
                where: {
                  postId_tagId: {
                    postId: post.id,
                    tagId: tag.id,
                  },
                },
              })
            )
          );
        }

        // 추가할 태그가 존재하는 경우
        if (added_tags.length > 0) {
          const tags = await Promise.all(
            added_tags.map(async (tag) => {
              // 태그 정보가 이미 존재하는지 체크
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

          await Promise.all(
            tags.map((tag) =>
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
      }

      if (isEmpty(newData)) {
        return responseWith({
          data: post.id,
        });
      }

      await tx.post.update({
        where: {
          id: input.id,
        },
        data: newData,
      });

      return responseWith({
        data: post.id,
      });
    });
  }),
  delete: creatorProcedure
    .input(schema.byId)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        select: _default_post_select,
      });

      if (!post) {
        throw new BadRequestError("PostNotFound", {
          http: {
            instance: "[trpc]: postsRouter.delete",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "게시글이 존재하지 않습니다.",
            }),
          },
        });
      }

      if (post.user.id !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: postsRouter.delete",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
          },
        });
      }

      if (post.postsTags.length > 0) {
        await ctx.prisma.postsTags.deleteMany({
          where: {
            postId: post.id,
          },
        });
      }

      await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });

      return responseWith({
        data: post.id,
      });
    }),
  unlike: publicProcedure
    .input(schema.byId)
    .mutation(async ({ ctx, input }) => {
      const cookies = getTrpcRouterCookie(ctx);
      const guestId = cookies.get(process.env.GUEST_ID_NAME, {
        signed: true,
      });

      if (!guestId) {
        throw new UnauthorizedError("Unauthorized", {
          http: {
            instance: "[trpc]: postsRouter.unlike",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_USED_GUEST_ID,
              resultMessage: "게스트 아이디가 존재하지 않습니다.",
            }),
          },
        });
      }

      const alreadyLiked = await ctx.prisma.postLike.findFirst({
        where: {
          postId: input.id,
          guestId,
        },
      });

      if (alreadyLiked) {
        try {
          await ctx.prisma.postLike.delete({
            where: {
              id: alreadyLiked.id,
            },
          });
        } catch (e) {}
      }

      const update_posts = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return responseWith({
        data: update_posts.likeCount,
      });
    }),
  like: publicProcedure.input(schema.byId).mutation(async ({ ctx, input }) => {
    const cookies = getTrpcRouterCookie(ctx);
    const guestId = cookies.get(process.env.GUEST_ID_NAME, {
      signed: true,
    });

    if (!guestId) {
      throw new UnauthorizedError("Unauthorized", {
        http: {
          instance: "[trpc]: postsRouter.like",
          extra: responseWith({
            ok: false,
            resultCode: RESULT_CODE.NOT_USED_GUEST_ID,
            resultMessage: "게스트 아이디가 존재하지 않습니다.",
          }),
        },
      });
    }

    const alreadyLiked = await ctx.prisma.postLike.findFirst({
      where: {
        postId: input.id,
        guestId,
      },
    });
    if (!alreadyLiked) {
      try {
        await ctx.prisma.postLike.create({
          data: {
            postId: input.id,
            guestId,
          },
        });
      } catch (e) {}
    }

    const update_posts = await ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return responseWith({
      data: update_posts.likeCount,
    });
  }),
  view: publicProcedure.input(schema.byId).query(async ({ ctx, input }) => {
    const cookies = getTrpcRouterCookie(ctx);
    const guestId = cookies.get(process.env.GUEST_ID_NAME, {
      signed: true,
    });

    if (!guestId) {
      throw new UnauthorizedError("Unauthorized", {
        http: {
          instance: "[trpc]: postsRouter.view",
          extra: responseWith({
            ok: false,
            resultCode: RESULT_CODE.NOT_USED_GUEST_ID,
            resultMessage: "게스트 아이디가 존재하지 않습니다.",
          }),
        },
      });
    }

    const post = await ctx.prisma.post.findFirst({
      where: {
        id: input.id,
      },
    });

    if (!post) {
      throw new BadRequestError("PostNotFound", {
        http: {
          instance: "[trpc]: postsRouter.byId",
          extra: responseWith({
            ok: false,
            resultCode: RESULT_CODE.NOT_FOUND,
            resultMessage: "게시글이 존재하지 않습니다.",
          }),
        },
      });
    }

    const update_posts = await ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return responseWith({
      data: update_posts.viewCount,
    });
  }),
});
