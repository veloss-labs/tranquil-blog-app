import { env } from "~/env/server.mjs";
import { schema } from "~/libs/validation/common";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { r2Manager } from "~/server/service/r2Manager";
import { responseWith } from "~/server/utils/response";

export const filesRouter = createTRPCRouter({
  presignedUrl: protectedProcedure
    .input(schema.upload)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      const key = r2Manager.generateKey(session, input);
      const presignedUrl = await r2Manager.getSignedUrlForPutObject({
        key,
        fileType: input.fileType,
        fileSize: input.fileSize
      });
      return responseWith({
        data: {
          key,
          presignedUrl,
        },
      });
    }),
  upload: protectedProcedure
    .input(schema.finalUpload)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      await ctx.prisma.postImage.create({
        data: {
          userId: session.id,
          url: input.key,
          uploadType: input.uploadType as string,
          mediaType: input.mediaType,
        }
      })

      return responseWith({
        data: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          url: `${env.CLOUDFLARE_R2_ENDPOINT}/${input.key}`,
        },
      });
    })
});
