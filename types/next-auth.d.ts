import "next-auth";
import { DefaultSession, DefaultJWT } from "next-auth";

export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  permissions: string[];
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username: string;
    permissions: string[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      username: string;
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    permissions: string[];
  }
}
