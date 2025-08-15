# Firebase Data Structure - Quick Reference

## Firestore Collections

### 1. Events Collection (`events`)

**Document ID**: Auto-generated or custom slug  
**Purpose**: Store event information and metadata

```json
{
  "title": "AI/ML Workshop 2024",
  "date": "2024-03-15T09:00:00Z",
  "description": "Hands-on workshop covering ML fundamentals with Python implementation",
  "coverImage": "https://firebasestorage.googleapis.com/v0/b/dmx-website/o/events%2Fai-workshop-cover.jpg",
  "speakers": ["Dr. John Doe", "Jane Smith", "Prof. Alice Johnson"],
  "venue": "Tech Lab, RGIT Main Campus",
  "mdxSlug": "ai-workshop-2024",
  "registrationLink": "https://forms.google.com/d/e/1FAIpQLSe..."
}
```

### 2. Projects Collection (`projects`)

**Document ID**: Auto-generated  
**Purpose**: Showcase student and club projects

```json
{
  "title": "AI Chatbot Assistant",
  "description": "Intelligent chatbot using GPT-3 API for student academic assistance and query resolution",
  "techStack": ["Python", "OpenAI GPT-3", "Flask", "React", "PostgreSQL"],
  "githubLink": "https://github.com/dmx-rgit/ai-chatbot",
  "demoLink": "https://dmx-chatbot.vercel.app",
  "coverImage": "https://firebasestorage.googleapis.com/v0/b/dmx-website/o/projects%2Fchatbot-cover.png",
  "featured": true
}
```

### 3. Team Collection (`team`)

**Document ID**: Auto-generated  
**Purpose**: Display team member information

```json
{
  "name": "John Doe",
  "role": "President & AI Research Lead",
  "photoUrl": "https://firebasestorage.googleapis.com/v0/b/dmx-website/o/team%2Fjohn-doe.jpg",
  "bio": "Passionate about machine learning and its applications in solving real-world problems. Leading research initiatives in computer vision.",
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "year": 3
}
```

## Sample Data for Testing

### Events Sample Data
```javascript
// Add to Firestore 'events' collection
const sampleEvents = [
  {
    title: "Machine Learning Bootcamp",
    date: new Date("2024-04-20T10:00:00"),
    description: "3-day intensive bootcamp covering supervised and unsupervised learning algorithms",
    coverImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
    speakers: ["Dr. Sarah Wilson", "Mark Thompson"],
    venue: "Computer Science Building, Room 301",
    mdxSlug: "ml-bootcamp-2024",
    registrationLink: "https://forms.google.com/ml-bootcamp"
  },
  {
    title: "Web Development Workshop",
    date: new Date("2024-05-15T14:00:00"),
    description: "Learn modern web development with React, Node.js, and MongoDB",
    coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    speakers: ["Alex Rivera", "Priya Sharma"],
    venue: "Innovation Lab, 2nd Floor",
    mdxSlug: "web-dev-workshop-2024"
  }
];
```

### Projects Sample Data
```javascript
// Add to Firestore 'projects' collection
const sampleProjects = [
  {
    title: "Smart Campus Navigation",
    description: "AR-based indoor navigation system for RGIT campus using computer vision and IoT sensors",
    techStack: ["Unity", "ARCore", "Python", "TensorFlow", "IoT Sensors"],
    githubLink: "https://github.com/dmx-rgit/smart-navigation",
    coverImage: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=800",
    featured: true
  },
  {
    title: "Student Performance Analytics",
    description: "Dashboard for analyzing student performance trends using machine learning algorithms",
    techStack: ["Python", "Pandas", "Scikit-learn", "Plotly", "Streamlit"],
    githubLink: "https://github.com/dmx-rgit/performance-analytics",
    demoLink: "https://dmx-analytics.streamlit.app",
    featured: false
  }
];
```

### Team Sample Data
```javascript
// Add to Firestore 'team' collection
const sampleTeam = [
  {
    name: "Arjun Patel",
    role: "President",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Computer Science senior specializing in AI/ML research and development",
    socialLinks: {
      github: "https://github.com/arjunpatel",
      linkedin: "https://linkedin.com/in/arjunpatel"
    },
    year: 4
  },
  {
    name: "Sneha Reddy",
    role: "Vice President & ML Engineer",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b743?w=400",
    bio: "Passionate about deep learning and computer vision applications",
    socialLinks: {
      github: "https://github.com/snehareddy",
      linkedin: "https://linkedin.com/in/snehareddy"
    },
    year: 3
  }
];
```

## Firebase Storage Structure

```
dmx-website-storage/
├── events/
│   ├── ai-workshop-cover.jpg
│   ├── ml-bootcamp-banner.png
│   └── web-dev-workshop.jpg
├── projects/
│   ├── chatbot-screenshot.png
│   ├── navigation-demo.gif
│   └── analytics-dashboard.jpg
├── team/
│   ├── john-doe.jpg
│   ├── sneha-reddy.jpg
│   └── arjun-patel.jpg
└── uploads/
    └── user-generated-content/
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to main collections
    match /{collection}/{document} {
      allow read: if collection in ['events', 'projects', 'team'];
      
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
    
    // User-specific data (if needed in future)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
      
      // Only authenticated users can upload files
      allow write: if request.auth != null;
    }
  }
}
```

## Environment Variables Needed

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

## Quick Setup Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

---

**Note**: Replace all placeholder URLs and IDs with actual Firebase project values. Ensure proper error handling in production code.
