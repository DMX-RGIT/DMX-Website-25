// NextAuth configuration for Google sign-in.
// Admin authorization is enforced with email allowlists in middleware and API routes.

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // Authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,     // Google OAuth Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google OAuth Client Secret
    }),
  ],
  
  pages: {
    signIn: '/login',
  },
  
  callbacks: {
    async session({ session }) {
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
