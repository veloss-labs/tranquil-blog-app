import isEqual from "lodash-es/isEqual";
import { schema } from "~/libs/validation/drafts";
import { createTRPCRouter, creatorProcedure } from "~/server/api/trpc";
import { BadRequestError, ForbiddenError } from "~/server/errors/httpException";
import { isEmpty } from "~/utils/assertion";
import { responseWith } from "~/server/utils/response";
import { RESULT_CODE } from "~/server/errors/code";

export const draftsRouter = createTRPCRouter({
  create: creatorProcedure
    .input(schema.create)
    .mutation(async ({ ctx, input }) => {
      const { title, content } = input;
      const draft = await ctx.prisma.post.create({
        data: {
          title,
          content,
          isDraft: true,
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
      const draft = await ctx.prisma.post.findUnique({
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

      const updateData: Record<string, string | undefined> = {};
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
      await ctx.prisma.post.update({
        where: {
          id,
        },
        data: updateData,
      });
      return responseWith({
        data: draft.id,
      });
    }),
});
