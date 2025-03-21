import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPremium?: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isPremium?: boolean;
  }
} 