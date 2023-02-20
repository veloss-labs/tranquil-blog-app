import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력해주세요.",
    })
    .email("이메일 형식이 올바르지 않습니다."),
  password: z
    .string({
      required_error: "비밀번호를 입력해주세요.",
    })
    .min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export const signupSchema = z
  .object({
    nickname: z
      .string({
        required_error: "닉네임을 입력해주세요.",
      })
      .min(2, "닉네임은 2자 이상이어야 합니다."),
    email: z
      .string({
        required_error: "이메일을 입력해주세요.",
      })
      .email("이메일 형식이 올바르지 않습니다."),
    password: z
      .string({
        required_error: "비밀번호를 입력해주세요.",
      })
      .min(6, "비밀번호는 6자 이상이어야 합니다."),
    passwordConfirm: z
      .string({
        required_error: "비밀번호 확인을 입력해주세요.",
      })
      .min(6, "비밀번호는 6자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;

export type SignupFormData = z.infer<typeof signupSchema>;
