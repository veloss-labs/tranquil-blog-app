import * as z from "zod";

export const schema = {
  list: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.number().nullish(),
    initialCursor: z.number().nullish(),
  }),
  pages: z.object({
    page: z.number().min(1).nullish(),
    pageSize: z.number().min(1).max(100).nullish(),
  }),
  upload: z.object({
    filename: z.string(),
    // png, jpg, jpeg, webp 만 허용이고 필수값
    fileType: z.string().regex(/(png|jpg|jpeg|webp)/),
    // 5MB 이하만 허용
    fileSize: z.number().max(5 * 1024 * 1024).optional(),
    uploadType: z.enum(['profile', 'posts', 'etc']).default('etc')
  }),
  finalUpload: z.object({
    key: z.string(),
    uploadType: z.enum(['profile', 'posts', 'etc']).default('etc'),
    mediaType: z.string(),
  })
};

export type ListData = z.infer<typeof schema.list>;

export type PagesData = z.infer<typeof schema.pages>;

export type FileUploadData = z.infer<typeof schema.upload>;

export type FinalFileUploadData = z.infer<typeof schema.finalUpload>
