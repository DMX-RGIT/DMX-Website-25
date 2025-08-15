# DataMatrix (DMX) Website - Complete Project Setup

## Project Structure
```
dmx-website/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── events/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── team/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── navbar.tsx
│   ├── auth/
│   │   ├── login-button.tsx
│   │   └── user-menu.tsx
│   ├── events/
│   │   ├── event-card.tsx
│   │   └── event-list.tsx
│   ├── projects/
│   │   └── project-card.tsx
│   └── team/
│       └── member-card.tsx
├── content/
│   └── events/
│       ├── index.mdx
│       └── [event-slug].mdx
├── lib/
│   ├── auth.ts
│   ├── firebase.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 1. Initialize Project & Install Dependencies

```bash
npx create-next-app@14 dmx-website --typescript --tailwind --app --src-dir=false
cd dmx-website

# Core dependencies
npm install next-auth firebase fumadocs-core fumadocs-ui fumadocs-mdx
npm install @radix-ui/react-icons lucide-react clsx tailwind-merge
npm install @tailwindcss/typography

# Dev dependencies
npm install -D @types/node
```

## 2. Environment Variables (.env.local)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 3. Configuration Files

### next.config.js
```javascript
import createMDX from 'fumadocs-mdx/config';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
};

export default withMDX(nextConfig);
```

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'
import { createPreset } from 'fumadocs-ui/tailwind-plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      colors: {
        dmx: {
          primary: '#8B5CF6',
          secondary: '#3B82F6',
          accent: '#10B981',
          dark: '#0F172A',
          light: '#F8FAFC',
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

## 4. Core Implementation Files

### types/index.ts
```typescript
export interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  coverImage: string;
  speakers?: string[];
  venue?: string;
  mdxSlug: string;
  registrationLink?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  coverImage?: string;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  year: number;
}
```

### lib/firebase.ts
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

### lib/auth.ts
```typescript
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### app/api/auth/[...nextauth]/route.ts
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### app/layout.tsx
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/navbar';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataMatrix - RGIT Tech Committee',
  description: 'Exploring AI/ML and cutting-edge technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-dmx-dark via-slate-900 to-dmx-dark">
            <Navbar />
            <main className="pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-dmx-primary via-dmx-secondary to-dmx-accent bg-clip-text text-transparent;
  }

  .card-hover {
    @apply transition-all duration-300 hover:scale-105 hover:shadow-2xl;
  }

  .glow {
    @apply shadow-lg shadow-dmx-primary/50;
  }
}
```

### components/providers.tsx
```tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### components/ui/navbar.tsx
```tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/user-menu';
import { LoginButton } from '@/components/auth/login-button';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-dmx-dark/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gradient">DMX</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/events" className="text-gray-300 hover:text-white transition">
                Events
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition">
                Projects
              </Link>
              <Link href="/team" className="text-gray-300 hover:text-white transition">
                Team
              </Link>
            </div>
          </div>
          <div>
            {session ? <UserMenu user={session.user} /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### app/page.tsx
```tsx
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedEvent } from '@/components/home/featured-event';
import { FeaturedProject } from '@/components/home/featured-project';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedEvent />
      <FeaturedProject />
    </div>
  );
}
```

### components/home/hero-section.tsx
```tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dmx-primary/20 via-transparent to-dmx-secondary/20" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-gradient">DataMatrix</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Exploring AI/ML and Cutting-Edge Technology at RGIT
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Link 
            href="/events" 
            className="px-8 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
          >
            Explore Events
          </Link>
          <Link 
            href="/projects" 
            className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
          >
            View Projects
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dmx-dark to-transparent" />
    </section>
  );
}
```

### app/events/page.tsx
```tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EventCard } from '@/components/events/event-card';
import { Event } from '@/types';

async function getEvents(): Promise<Event[]> {
  const eventsCol = collection(db, 'events');
  const snapshot = await getDocs(eventsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### app/events/[slug]/page.tsx
```tsx
import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/app/source';
import { MDXContent } from '@/components/mdx-content';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function EventPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = getPage(['events', params.slug]);
  
  if (!page) {
    notFound();
  }

  // Get additional metadata from Firestore
  const eventDoc = await getDoc(doc(db, 'events', params.slug));
  const eventData = eventDoc.exists() ? eventDoc.data() : null;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
          {page.data.title}
        </h1>
        {eventData && (
          <div className="mb-8 text-gray-400">
            <p>Date: {new Date(eventData.date.toDate()).toLocaleDateString()}</p>
            {eventData.venue && <p>Venue: {eventData.venue}</p>}
          </div>
        )}
        <div className="prose prose-invert max-w-none">
          <MDXContent code={page.data.body} />
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = getPages();
  return pages
    .filter(page => page.slugs[0] === 'events')
    .map(page => ({ slug: page.slugs[1] }));
}
```

### app/projects/page.tsx
```tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectCard } from '@/components/projects/project-card';
import { Project } from '@/types';

async function getProjects(): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const snapshot = await getDocs(projectsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### app/team/page.tsx
```tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberCard } from '@/components/team/member-card';
import { TeamMember } from '@/types';

async function getTeamMembers(): Promise<TeamMember[]> {
  const teamCol = collection(db, 'team');
  const snapshot = await getDocs(teamCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### components/events/event-card.tsx
```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.mdxSlug}`}>
      <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
        {event.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition">
            {event.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString()}
            </div>
            {event.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### components/projects/project-card.tsx
```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';
import { Github, ExternalLink } from 'lucide-react';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
      {project.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-dmx-primary/20 text-dmx-primary rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

### components/team/member-card.tsx
```tsx
'use client';

import Image from 'next/image';
import { TeamMember } from '@/types';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
      <div className="relative h-64 w-full">
        <Image
          src={member.photoUrl}
          alt={member.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark via-dmx-dark/50 to-transparent opacity-60" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white">{member.name}</h3>
        <p className="text-dmx-primary text-sm mb-2">{member.role}</p>
        <div className="flex gap-3">
          {member.socialLinks.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

### app/source.ts (Fumadocs configuration)
```typescript
import { map } from '@/.map';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

export const { getPage, getPages, pageTree } = loader({
  baseUrl: '/events',
  rootDir: 'events',
  source: createMDXSource(map),
});
```

### content/events/index.mdx
```mdx
---
title: DataMatrix Events
description: Explore our tech events and workshops
---

# DataMatrix Events

Welcome to our events section. Here you'll find information about our past and upcoming tech events, workshops, and seminars.
```

### content/events/ai-workshop-2024.mdx
```mdx
---
title: AI/ML Workshop 2024
description: Hands-on workshop on machine learning fundamentals
date: 2024-03-15
---

# AI/ML Workshop 2024

Join us for an intensive hands-on workshop covering the fundamentals of machine learning and artificial intelligence.

## What You'll Learn

- Introduction to Machine Learning
- Neural Networks and Deep Learning
- Practical implementation with Python
- Real-world project development

## Prerequisites

- Basic Python knowledge
- Understanding of mathematics (linear algebra, calculus)
- Laptop with Python installed

## Schedule

- **9:00 AM - 10:30 AM**: Introduction to ML
- **10:45 AM - 12:30 PM**: Hands-on coding session
- **2:00 PM - 4:00 PM**: Project development
- **4:00 PM - 5:00 PM**: Presentations and Q&A
```

## 5. Firebase Firestore Structure

Create these collections in your Firebase Firestore:

### Events Collection
```json
{
  "id": "auto-generated",
  "title": "AI/ML Workshop 2024",
  "date": "2024-03-15T09:00:00",
  "description": "Hands-on workshop on machine learning fundamentals",
  "coverImage": "https://...",
  "speakers": ["Dr. John Doe", "Jane Smith"],
  "venue": "Tech Lab, RGIT",
  "mdxSlug": "ai-workshop-2024",
  "registrationLink": "https://..."
}
```

### Projects Collection
```json
{
  "id": "auto-generated",
  "title": "AI Chatbot Assistant",
  "description": "An intelligent chatbot using GPT-3 for student queries",
  "techStack": ["Python", "OpenAI", "Flask", "React"],
  "githubLink": "https://github.com/...",
  "demoLink": "https://...",
  "coverImage": "https://...",
  "featured": true
}
```

### Team Collection
```json
{
  "id": "auto-generated",
  "name": "John Doe",
  "role": "President",
  "photoUrl": "https://...",
  "bio": "Passionate about AI and machine learning",
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "year": 3
}
```

## 6. Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Build locally to test
npm run build
npm run start
```

## 7. Additional Features to Add Later

- Admin dashboard for content management
- Event registration system
- Blog section
- Newsletter subscription
- Member achievements/certificates
- Project submission portal
- Interactive AI demos

## Notes

- The design uses a modern dark theme with gradient accents inspired by tech aesthetics
- Authentication is set up to show additional content for logged-in users
- Fumadocs handles MDX rendering for rich event content
- Firebase Firestore provides real-time data updates
- The site is optimized for performance with Next.js 14's app directory