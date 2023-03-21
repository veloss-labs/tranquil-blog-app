import type { GetServerSidePropsContext } from "next";
import omit from "lodash-es/omit";
import Cookies from "cookies";
import { getToken } from "next-auth/jwt";
import { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import { generateHash, secureCompare } from "./utils/password";
import type { User, UserProfile, UserRole } from "@prisma/client";
import type { TRPCContext } from "./api/trpc";
import { env } from "~/env/server.mjs";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserSchema;
  }
}

export interface UserSchema
  extends Pick<User, "id" | "email" | "createdAt" | "updatedAt"> {
  profile: Omit<UserProfile, "userId">;
  role: Pick<UserRole, "authority">;
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      // I skipped the line below coz it gave me a TypeError
      // session.accessToken = token.accessToken;
      if (session && session.user && token.session) {
        const typeSafeToken = token as {
          session: UserSchema;
        };
        // @ts-ignore
        session.user = typeSafeToken.session;
      }

      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          session: user,
        };
      }
      return token;
    },
    redirect: ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            salt: true,
            profile: {
              select: {
                username: true,
                bio: true,
                profileUrl: true,
                website: true,
                location: true,
              },
            },
            role: {
              select: {
                authority: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) {
          return null;
        }

        if (user.password && user.salt) {
          if (
            !secureCompare(
              user.password,
              generateHash(credentials.password, user.salt)
            )
          ) {
            return null;
          }
        }

        const omitUser = omit(user, ["password", "salt"]);
        return omitUser;
      },
    }),
  ],
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // return getServerSession(ctx.req, ctx.res, authOptions);
  const token = await getToken({ req: ctx.req });
  if (!token) {
    return null;
  }
  return token.session as UserSchema;
};

export enum AuthMode {
  USER = "CREATOR",
  CREATOR = "CREATOR",
}

export const getServerAuthValidation = (
  session: UserSchema | null,
  mode: AuthMode = AuthMode.USER
) => {
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (mode === AuthMode.CREATOR) {
    // Only creator can access this page
    if (session.role.authority !== "CREATOR") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    redirect: null,
  };
};

export const getTrpcRouterCookie = (ctx: TRPCContext) => {
  const keys = [env.GUEST_ID_COOKIE_SECRET];
  const cookies = new Cookies(ctx.req, ctx.res, { keys: keys });
  return cookies;
};
