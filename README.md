# DMX Website - RGIT Tech Committee

This is a Next.js-based website for the DataMatrix (DMX) Tech Committee at RGIT, showcasing events, projects, gallery, and team members. The site uses modern web technologies including TypeScript, Tailwind CSS, Supabase (for Events Database), NextAuth, and MDX for content management.

## Project Structure

### Root Directory Files
- **`package.json`** - Node.js dependencies and scripts. Run `npm install` to install dependencies, `npm run dev` to start the development server.
- **`tailwind.config.ts`** - Tailwind CSS configuration.
- **`tsconfig.json`** - TypeScript configuration.
- **`SUPABASE_MIGRATION.md`** - Documentation for the transition from purely MDX/Firebase to a Supabase PostgreSQL backend.
- **`README.md`** - This file, containing project overview and structure.

### `app/` Directory - Next.js App Router
Contains the main application pages and API routes.

- **`layout.tsx`** - Root layout component, strictly wraps public views vs. admin dashboard layouts dynamically via a custom `ClientLayoutWrapper`.
- **`page.tsx`** - Homepage component.
- **`about/page.tsx`** - About page detailing the committee's vision, mission, and stats.
- **`gallery/page.tsx`** - Gallery page showcasing event images in a dynamic grid layout with active background blurring.
- **`not-found.tsx`** - Custom stylized 404 page for missing routes, directing user safely back to home.

#### `app/login/` - Authentication
- **`page.tsx`** - Simplified login flow executing NextAuth checks to authenticate system administrators via whitelist config.

#### `app/admin/` - Custom Admin CMS
A fully functional Content Management System to update backend databases and content. Includes mobile-optimized dashboard sidebar.
- **`layout.tsx`** - Dashboard frame and sidebar navigation logic (desktop and mobile sliding sidebar).
- **`page.tsx`** - CMS Overview displaying quick actions, connection stats, and data notices.
- **`events/page.tsx`** - Connected to the Supabase Postgres client. Creates, updates, or deletes live events data.
- **`projects/page.tsx`** - Editors to stringify and write project MDX data to `public/images/`.
- **`gallery/page.tsx`** - Event gallery manager backed by Supabase event records.
- **`team/page.tsx`** - JSON editor to establish cohorts in `content/team/`.

#### `app/events/` - Events Pages
- **`page.tsx`** - Events listing page dynamically querying past public events from the Supabase database.
- **`[slug]/page.tsx`** - Dynamic event detail page pulling live content.

#### `app/projects/` - Projects Pages
- **`page.tsx`** - Projects listing page, reads MDX files from `public/images/project-files/`.

#### `app/team/` - Team Page
- **`page.tsx`** - Team roster separated by year cohorts.

#### `app/api/` - Backend Routes
- **`auth/[...nextauth]/route.ts`** - Handles Google O-Auth and admin authorization session tokens mappings.
- **`admin/events/`** - REST endpoints bridging Supabase event insertion, editing, and deletion operations directly from the CMS.
- **`admin/uploads/`** - Handles local file system or cloud-bucket storage uploads from the CMS interface.

### `components/` Directory - Reusable React Components
- **`ui/navbar.tsx`** - Main navigation bar hidden during admin routes logic to ensure isolation.
- **`ui/client-layout-wrapper.tsx`** - Controls Next.js client-boundary transitions and resets padding for full-bleed Admin UI.

### `public/images/` Directory - Static Assets
- **`team/`** - Member profile photos.
- **`event-files/` & `project-files/`** - MDX Markdown content files bundled alongside specific graphic assets for markdown compiling.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` to `.env.local` and add your required Postgres/Supabase configuration URLs + NextAuth `NEXTAUTH_SECRET` strings.

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view the site.
   - Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to manage content.

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## Key Technologies
- **Next.js 15 (App Router)** - Modern React application framing
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS styling framework
- **Supabase (PostgreSQL)** - Handles rapid-firing Event CRUD queries and active syncing
- **NextAuth.js** - Protected administrative sessions
- **Framer Motion** - Interactive CSS animations
- **Lucide React** - Universal icon library
