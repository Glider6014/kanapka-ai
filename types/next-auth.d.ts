import 'next-auth';
import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    permissions: string[];
    subscriptionType: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      username: string;
      displayName: string;
      permissions: string[];
      subscriptionType: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    username: string;
    displayName: string;
    permissions: string[];
    subscriptionType: string;
  }
}
