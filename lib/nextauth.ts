import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSession } from "next-auth";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!NEXTAUTH_SECRET) {
  throw new Error("You must provide a NEXTAUTH_SECRET environment variable");
}

async function getUserWithoutPassword(userId: string) {
  await connectDB();

  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    permissions: user.permissions,
  };
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({
          $or: [
            { email: credentials.emailOrUsername },
            { username: credentials.emailOrUsername },
          ],
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          permissions: user.permissions,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      return user ? { ...token, ...user } : token;
    },

    async session({ session, token }) {
      const user = await getUserWithoutPassword(token.id);
      if (!user) throw new Error("User no longer exists");

      session.user = user;

      return session;
    },
  },
  pages: {
    signIn: "/user/signin",
    error: "/user/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

export async function getServerSessionAuth() {
  return getServerSession(authOptions);
}
