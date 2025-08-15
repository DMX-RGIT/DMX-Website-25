# DMX Website - Integration Guide

## Overview
This document provides comprehensive guidance for Firebase and Fumadocs integrators working on the DataMatrix (DMX) website. The project is built with Next.js 14, TypeScript, Tailwind CSS, and is designed to integrate with Firebase for data storage and Fumadocs for rich content management.

## 🏗️ Project Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Content**: Fumadocs (MDX) - *To be integrated*
- **Styling**: Tailwind CSS with custom DMX theme
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
dmx-website/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages group
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── api/auth/[...nextauth]/   # NextAuth API routes
│   ├── events/                   # Events section
│   │   ├── page.tsx              # Events listing page
│   │   └── [slug]/page.tsx       # Individual event page
│   ├── projects/page.tsx         # Projects page
│   ├── team/page.tsx            # Team page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── auth/                    # Authentication components
│   ├── events/                  # Event-related components
│   ├── home/                    # Homepage components
│   ├── projects/                # Project components
│   ├── team/                    # Team components
│   └── ui/                      # UI components
├── lib/                         # Utility libraries
│   ├── auth.ts                  # NextAuth configuration
│   ├── firebase.ts              # Firebase configuration
│   └── utils.ts                 # Utility functions
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Main type definitions
├── content/                     # MDX content (for Fumadocs)
└── public/                      # Static assets
```

## 🔥 Firebase Integration Guide

### Current Status
- ✅ Firebase configuration set up
- ✅ Firestore database integration ready
- ✅ Firebase Storage configured
- ✅ Authentication structure prepared
- ⚠️ **Requires actual Firebase project setup**

### Required Firebase Collections

#### 1. Events Collection (`events`)
```typescript
interface Event {
  id: string;                    // Auto-generated document ID
  title: string;                 // Event title
  date: Timestamp;               // Event date (use Firebase Timestamp)
  description: string;           // Event description
  coverImage: string;            // Firebase Storage URL
  speakers?: string[];           // Array of speaker names
  venue?: string;                // Event location
  mdxSlug: string;              // Slug for MDX content
  registrationLink?: string;     // Registration URL
}
```

**Example Document:**
```json
{
  "title": "AI/ML Workshop 2024",
  "date": "2024-03-15T09:00:00Z",
  "description": "Hands-on workshop on machine learning fundamentals",
  "coverImage": "https://firebasestorage.googleapis.com/v0/b/your-project/o/events%2Fai-workshop.jpg",
  "speakers": ["Dr. John Doe", "Jane Smith"],
  "venue": "Tech Lab, RGIT",
  "mdxSlug": "ai-workshop-2024",
  "registrationLink": "https://forms.google.com/..."
}
```

#### 2. Projects Collection (`projects`)
```typescript
interface Project {
  id: string;                    // Auto-generated document ID
  title: string;                 // Project title
  description: string;           // Project description
  techStack: string[];           // Technologies used
  githubLink?: string;           // GitHub repository URL
  demoLink?: string;             // Live demo URL
  coverImage?: string;           // Firebase Storage URL
  featured: boolean;             // Show on homepage
}
```

#### 3. Team Collection (`team`)
```typescript
interface TeamMember {
  id: string;                    // Auto-generated document ID
  name: string;                  // Member name
  role: string;                  // Position/role
  photoUrl: string;              // Firebase Storage URL
  bio?: string;                  // Biography
  socialLinks: {                 // Social media links
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  year: number;                  // Academic/graduation year
}
```

### Firebase Setup Steps

1. **Create Firebase Project**
   ```bash
   # Go to https://console.firebase.google.com/
   # Create new project: "dmx-website"
   # Enable Firestore Database
   # Enable Firebase Storage
   # Enable Authentication (Google provider)
   ```

2. **Update Environment Variables**
   ```env
   # Replace in .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Configure Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public read access for events, projects, team
       match /{collection}/{document} {
         allow read: if collection in ['events', 'projects', 'team'];
         allow write: if request.auth != null; // Only authenticated users can write
       }
     }
   }
   ```

4. **Configure Storage Security Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true; // Public read access
         allow write: if request.auth != null; // Only authenticated users can upload
       }
     }
   }
   ```

### Key Integration Points

#### Events Data Fetching
- **Location**: `app/events/page.tsx`
- **Function**: `getEvents()`
- **Purpose**: Fetches all events for the events listing page

#### Individual Event Display
- **Location**: `app/events/[slug]/page.tsx`
- **Purpose**: Shows detailed event information
- **Note**: Currently uses document ID as slug, ready for MDX integration

#### Projects and Team
- Similar patterns in `app/projects/page.tsx` and `app/team/page.tsx`

## 📚 Fumadocs Integration Guide

### Current Status
- ⚠️ **Fumadocs removed temporarily due to build issues**
- 🔄 **Ready for integration**
- ✅ MDX content structure prepared

### Integration Steps

1. **Reinstall Fumadocs Dependencies**
   ```bash
   npm install fumadocs-core fumadocs-ui fumadocs-mdx --legacy-peer-deps
   ```

2. **Update Next.js Configuration**
   ```javascript
   // next.config.js
   import { createMDX } from 'fumadocs-mdx/config';
   
   const withMDX = createMDX();
   
   const nextConfig = {
     images: {
       domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
     },
   };
   
   export default withMDX(nextConfig);
   ```

3. **Create Source Configuration**
   ```typescript
   // app/source.ts
   import { map } from '@/.map';
   import { createMDXSource } from 'fumadocs-mdx';
   import { loader } from 'fumadocs-core/source';
   
   export const { getPage, getPages, pageTree } = loader({
     baseUrl: '/events',
     source: createMDXSource(map),
   });
   ```

4. **Update Event Detail Page**
   ```typescript
   // app/events/[slug]/page.tsx
   import { getPage } from '@/app/source';
   import { MDXContent } from '@/components/mdx-content';
   
   export default async function EventPage({ params }) {
     // Get Firestore data
     const eventDoc = await getDoc(doc(db, 'events', params.slug));
     const eventData = eventDoc.data();
     
     // Get MDX content
     const page = getPage(['events', eventData.mdxSlug]);
     
     return (
       <div>
         <h1>{eventData.title}</h1>
         {page && <MDXContent code={page.data.body} />}
       </div>
     );
   }
   ```

5. **Create MDX Content Structure**
   ```
   content/
   └── events/
       ├── index.mdx
       ├── ai-workshop-2024.mdx
       ├── web-dev-bootcamp.mdx
       └── hackathon-2024.mdx
   ```

### MDX Content Format
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

## Prerequisites
- Basic Python knowledge
- Understanding of mathematics (linear algebra, calculus)
```

## 🎨 Styling System

### Custom Theme Colors
```css
dmx: {
  primary: '#8B5CF6',    /* Purple */
  secondary: '#3B82F6',  /* Blue */
  accent: '#10B981',     /* Green */
  dark: '#0F172A',       /* Dark background */
  light: '#F8FAFC',      /* Light text */
}
```

### Utility Classes
- `.text-gradient` - Gradient text effect
- `.card-hover` - Hover animation for cards
- `.glow` - Purple glow effect

## 🔐 Authentication Flow

### Current Setup
1. Google OAuth configured via NextAuth.js
2. Custom login page at `/login`
3. User menu component shows authenticated state
4. Session management handled by NextAuth

### Integration with Firebase Auth (Optional)
If you want to sync NextAuth with Firebase Auth:

```typescript
// lib/auth.ts - Enhanced version
callbacks: {
  async session({ session, token }) {
    if (session?.user) {
      // Create or update user in Firestore
      const userRef = doc(db, 'users', token.sub!);
      await setDoc(userRef, {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        lastLogin: new Date(),
      }, { merge: true });
    }
    return session;
  },
}
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Firebase project configured
- [ ] Environment variables set in Vercel
- [ ] Firestore collections populated with sample data
- [ ] Images uploaded to Firebase Storage
- [ ] Google OAuth credentials configured for production domain

### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
# Firebase config for production
```

## 🐛 Common Issues & Solutions

### Firebase Connection Issues
- Ensure all environment variables are correctly set
- Check Firebase project permissions
- Verify Firestore security rules allow read access

### Build Errors
- Run `npm run build` to check for TypeScript errors
- Ensure all imports are correctly typed
- Check for missing dependencies

### Fumadocs Integration Issues
- Verify `fumadocs-mdx` version compatibility
- Check MDX file format and frontmatter
- Ensure `.map` file is generated correctly

## 📞 Support

For integration support:
1. Check the GitHub repository for issues
2. Review Next.js 14 and Firebase documentation
3. Test with sample data before production deployment

---

**Note**: This project follows the exact specifications from the original setup guide. All components are properly typed and ready for integration.
