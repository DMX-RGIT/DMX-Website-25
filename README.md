# DMX Website - RGIT Tech Committee

This is a Next.js-based website for the DataMatrix (DMX) Tech Committee at RGIT, showcasing events, projects, gallery, and team members. The site uses modern web technologies including TypeScript, Tailwind CSS, Firebase, and MDX for content management.

## Project Structure

### Root Directory Files
- **`package.json`** - Node.js dependencies and scripts. Run `npm install` to install dependencies, `npm run dev` to start the development server.
- **`tailwind.config.ts`** - Tailwind CSS configuration.
- **`tsconfig.json`** - TypeScript configuration.
- **`FIREBASE_REFERENCE.md`** - Documentation for Firebase setup and usage.
- **`README.md`** - This file, containing project overview and structure.

### `app/` Directory - Next.js App Router
Contains the main application pages and API routes.

- **`layout.tsx`** - Root layout component, includes the unified navbar and providers.
- **`page.tsx`** - Homepage component.
- **`about/page.tsx`** - About page detailing the committee's vision, mission, and stats.
- **`gallery/page.tsx`** - Gallery page showcasing event images in a dynamic Bento Box grid.

#### `app/(auth)/` - Authentication Pages
- **`login/page.tsx`** - Login page accessing Firebase to authorize admin users.
- **`register/page.tsx`** - Registration interface for new admin members.

#### `app/admin/` - Local Admin CMS
A fully functional Content Management System to update the repository's files directly via the browser.
- **`layout.tsx`** - Dashboard frame and sidebar navigation.
- **`page.tsx`** - CMS Overview component.
- **`events/page.tsx`** & **`projects/page.tsx`** - Editors to stringify and write MDX data to `public/images/`.
- **`gallery/page.tsx`** - JSON visual editor mapping to `content/gallery.json`.
- **`team/page.tsx`** - JSON editor to establish cohorts in `content/team/`.

#### `app/events/` - Events Pages
- **`page.tsx`** - Events listing page, reads MDX files from `public/images/event-files/`.
- **`[slug]/page.tsx`** - Dynamic event detail page.

#### `app/projects/` - Projects Pages
- **`page.tsx`** - Projects listing page, reads MDX files from `public/images/project-files/`.

#### `app/team/` - Team Page
- **`page.tsx`** - Team roster separated by year cohorts.

#### `app/api/admin/` - CMS Backend
- Houses API endpoints (`events`, `projects`, `gallery`, `team`) that utilize Node's native `fs` module to perform file-system CRUD edits directly into the local repo infrastructure.

### `components/` Directory - Reusable React Components
- **`ui/navbar.tsx`** - Main navigation bar dynamically hidden during auth/admin modes.
- **`home/`, `events/`, `projects/`, `team/`** - Reusable modular UI parts for different frontend sections.

### `content/` Directory - Data Structures
Contains JSON mappings manually edited or managed by the local CMS.
- **`gallery.json`** - Schema of image strings and custom visual categories.
- **`team/`** - JSON arrays representing user cohorts (e.g., `2025.json`).

### `public/images/` Directory - Static Assets
- **`team/`** - Member profile photos.
- **`event-files/` & `project-files/`** - MDX Markdown content files bundled alongside specific graphic assets for markdown compiling.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` to `.env.local` and add your Firebase configuration credentials.

3. **Run Development Server (CMS Supported):**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view the site.
   - Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to manage local dynamic content files safely.

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## Key Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS styling framework
- **Firebase** - Database logins and registration
- **MDX & Gray-Matter** - Markdown paired with JSX parsing
- **Framer Motion** - Interactive CSS animations
- **Lucide React** - Universal icon library
