import isEqual from "lodash-es/isEqual";
import { schema } from "~/libs/validation/drafts";
import { createTRPCRouter, creatorProcedure } from "~/server/api/trpc";
import { BadRequestError, ForbiddenError } from "~/server/errors/httpException";
import { isEmpty } from "~/utils/assertion";
import { Prisma } from "@prisma/client";
import { responseWith } from "~/server/utils/response";
import { RESULT_CODE } from "~/server/errors/code";

const _default_post_draft_select = Prisma.validator<Prisma.PostDraftSelect>()({
  id: true,
  title: true,
  content: true,
  userId: true,
});

export const draftsRouter = createTRPCRouter({
  byId: creatorProcedure.input(schema.byId).query(async ({ ctx, input }) => {
    const { id } = input;
    const draft = await ctx.prisma.postDraft.findUnique({
      where: {
        id,
      },
      select: _default_post_draft_select,
    });
    if (isEmpty(draft)) {
      throw new BadRequestError("Draft not found");
    }
    return responseWith({
      data: draft,
    });
  }),
  create: creatorProcedure
    .input(schema.create)
    .mutation(async ({ ctx, input }) => {
      const { title, content } = input;
      const draft = await ctx.prisma.postDraft.create({
        data: {
          title,
          content,
          userId: ctx.session.id,
        },
      });
      return responseWith({
        data: draft.id,
      });
    }),
  update: creatorProcedure
    .input(schema.update)
    .mutation(async ({ ctx, input }) => {
      const { id, title, content } = input;
      const draft = await ctx.prisma.postDraft.findUnique({
        where: {
          id,
        },
      });
      if (!draft) {
        throw new BadRequestError("PostDraftNotFound", {
          http: {
            instance: "[trpc]: draftsRouter.update",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "초안이 존재하지 않습니다.",
            }),
          },
        });
      }
      if (draft.userId !== ctx.session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: draftsRouter.update",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
          },
        });
      }

      const updateData: Prisma.PostDraftUpdateInput = {};
      if (!isEqual(draft.title, title)) {
        updateData.title = title ?? "Untitled";
      }
      if (!isEqual(draft.content, content)) {
        updateData.content = content ?? "";
      }

      if (isEmpty(updateData)) {
        return responseWith({
          data: draft.id,
        });
      }
      await ctx.prisma.postDraft.update({
        where: {
          id,
        },
        data: updateData,
      });
      return responseWith({
        data: draft.id,
      });
    }),
  delete: creatorProcedure
    .input(schema.byId)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const draft = await ctx.prisma.postDraft.findUnique({
        where: {
          id,
        },
      });
      if (!draft) {
        throw new BadRequestError("PostDraftNotFound", {
          http: {
            instance: "[trpc]: draftsRouter.delete",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "초안이 존재하지 않습니다.",
            }),
          },
        });
      }
      if (draft.userId !== ctx.session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: draftsRouter.delete",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
          },
        });
      }
      await ctx.prisma.postDraft.delete({
        where: {
          id,
        },
      });
      return responseWith({
        data: draft.id,
      });
    }),
});
