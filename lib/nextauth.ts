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

async function getCurrentUser(userId: string) {
  await connectDB();

  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    permissions: user.permissions,
  };
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
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
          permissions: user.permissions,
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
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.permissions = user.permissions;
      }

      return token;
    },

    async session({ session, token }) {
      const currentUser = await getCurrentUser(token.id);

      if (!currentUser) {
        throw new Error("User no longer exists");
      }

      session.user = currentUser;

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
