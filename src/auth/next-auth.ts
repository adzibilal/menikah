import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Admins, Users } from "@/db/schema";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // First, check the admins table
        const admins = await db
          .select()
          .from(Admins)
          .where(eq(Admins.email, credentials.email as string))
          .execute();

        const admin = admins[0];

        if (admin) {
          const isValid = await compare(credentials.password as string, admin.password_hash);
          if (isValid) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name || "",
              role: 'admin'
            };
          }
        }

        // If no admin found or password incorrect, check the users table
        const users = await db
          .select()
          .from(Users)
          .where(eq(Users.email, credentials.email as string))
          .execute();

        const user = users[0];

        if (user) {
          const isValid = await compare(credentials.password as string, user.password_hash);
          if (isValid) {
            return {
              id: user.user_id,
              email: user.email,
              name: user.name || "",
              role: 'user'
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          email: token.email,
          name: token.name,
          role: token.role as string,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);