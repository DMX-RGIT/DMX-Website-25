// NextAuth configuration for admin credentials sign-in.
// Admin authorization is enforced with email allowlists and an admin password.

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // Authentication providers
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!email || !password || !adminPassword) return null;
        if (!isAdminEmail(email)) return null;
        if (password !== adminPassword) return null;

        return {
          id: email,
          name: email.split('@')[0],
          email,
          isAdmin: true,
        };
      },
    }),
  ],
  
  pages: {
    signIn: '/login',
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email || token.email;
        token.name = user.name || token.name;
        token.isAdmin = Boolean(user.isAdmin);
      }

      if (typeof token.isAdmin !== 'boolean') {
        token.isAdmin = isAdminEmail((token.email as string | undefined) || null);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string | undefined) || session.user.email;
        session.user.name = (token.name as string | undefined) || session.user.name;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/admin`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
