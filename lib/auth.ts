// NextAuth Configuration
// Handles authentication using Google OAuth and integrates with Firebase
// This file configures NextAuth.js for the DMX website

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // Authentication providers - currently only Google OAuth
  // TODO: Add more providers if needed (GitHub, Discord, etc.)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,     // Google OAuth Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google OAuth Client Secret
    }),
  ],
  
  // Custom pages for authentication flow
  pages: {
    signIn: '/login',  // Custom login page route
  },
  
  // Callbacks to customize the authentication flow
  callbacks: {
    // Session callback - runs whenever a session is checked
    async session({ session }) {
      // Currently just returns the session as-is
      // TODO: Add custom user data from Firestore if needed
      return session;
    },
  },
  
  // Secret key for JWT token encryption
  secret: process.env.NEXTAUTH_SECRET,
};
