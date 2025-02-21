import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Admins } from "@/db/schema";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        const admins = await db
          .select()
          .from(Admins)
          .where(eq(Admins.email, credentials.email as string))
          .execute();

        const admin = admins[0];

        if (!admin) {
          return null;
        }

        // Compare the provided password with the stored password hash
        const isValid = await compare(credentials.password as string, admin.password_hash);

        if (isValid) {
          return {
            id: admin.id,
            email: admin.email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add the admin ID to the session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add the admin ID to the JWT token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in your .env file
});