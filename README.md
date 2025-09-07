# DMX Website - RGIT Tech Committee

This is a Next.js-based website for the DataMatrix (DMX) Tech Committee at RGIT, showcasing events, projects, and team members. The site uses modern web technologies including TypeScript, Tailwind CSS, Firebase, and MDX for content.

## Project Structure

### Root Directory Files
- **`package.json`** - Node.js dependencies and scripts. Run `npm install` to install dependencies, `npm run dev` to start development server.
- **`next.config.js`** - Next.js configuration file.
- **`tailwind.config.ts`** - Tailwind CSS configuration.
- **`tsconfig.json`** - TypeScript configuration.
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind.
- **`next-env.d.ts`** - Next.js TypeScript environment declarations.
- **`.eslintrc.json`** - ESLint configuration for code linting.
- **`.gitignore`** - Files to ignore in Git (includes node_modules, build files, etc.).
- **`FIREBASE_REFERENCE.md`** - Documentation for Firebase setup and usage.
- **`INTEGRATION_GUIDE.md`** - Guide for integrating various services.
- **`dmx-nextjs-setup.md`** - Setup instructions specific to this project.
- **`README.md`** - This file, containing project overview and structure.

### `app/` Directory - Next.js App Router
Contains the main application pages and API routes using Next.js 13+ App Router.

- **`layout.tsx`** - Root layout component, includes navbar and providers.
- **`page.tsx`** - Homepage component.
- **`globals.css`** - Global CSS styles.
- **`favicon.ico`** - Website favicon.

#### `app/(auth)/` - Authentication Pages
- **`login/page.tsx`** - Login page (currently unused, uses Firebase for auth).
- **`register/page.tsx`** - Registration page (currently unused).

#### `app/admin/` - Admin Dashboard
- **`page.tsx`** - Admin dashboard page (currently unused).

#### `app/events/` - Events Pages
- **`page.tsx`** - Events listing page, reads MDX files from `public/images/event-files/`.
- **`[slug]/page.tsx`** - Dynamic event detail page, renders individual event MDX content.

#### `app/projects/` - Projects Pages
- **`page.tsx`** - Projects listing page, reads MDX files from `public/images/project-files/`.
- **`[slug]/page.tsx`** - Dynamic project detail page (currently not implemented).

#### `app/team/` - Team Page
- **`page.tsx`** - Team members page, displays team carousel and member lists.

#### `app/speakers/` - Speakers Page
- **`page.tsx`** - Speakers showcase page (currently unused due to incorrect import path).

#### `app/api/` - API Routes
- **`auth/[...nextauth]/route.ts`** - NextAuth.js API route for authentication.

### `components/` Directory - Reusable React Components
Organized by feature/page for better maintainability.

- **`providers.tsx`** - Context providers (e.g., for authentication, theme).
- **`mdx-content.tsx`** - Component for rendering MDX content (currently unused).

#### `components/ui/` - UI Components
- **`navbar.tsx`** - Main navigation bar with links to all pages.

#### `components/auth/` - Authentication Components
- **`login-button.tsx`** - Button for signing in (uses NextAuth).
- **`user-menu.tsx`** - User menu for authenticated users.

#### `components/home/` - Homepage Components
- **`hero-section.tsx`** - Hero section on homepage.
- **`featured-event.tsx`** - Featured event component.
- **`featured-project.tsx`** - Featured project component.

#### `components/events/` - Events Components
- **`event-card.tsx`** - Card component for displaying events.
- **`image-gallery.tsx`** - Gallery component for event images.

#### `components/projects/` - Projects Components
- **`project-card.tsx`** - Card component for displaying projects.

#### `components/team/` - Team Components
- **`member-card.tsx`** - Card for team members.
- **`team-carousel.tsx`** - Carousel for displaying team members.
- **`speaker-carousel.tsx`** - Carousel for speakers (used in team page).
- **`year-selector.tsx`** - Component for selecting team year.

### `content/` Directory - Content Files
Contains JSON and MDX files for dynamic content.

#### `content/events/` - Event Content
- **`index.mdx`** - Index page for events (currently unused).
- **`ai-workshop-2024.mdx`** - Content for AI Workshop 2024 event (currently unused).

#### `content/team/` - Team Data
- **`members.json`** - Team member data.
- **`2024.json`** - Team data for 2024.
- **`2025.json`** - Team data for 2025.

### `lib/` Directory - Utility Libraries
- **`firebase.ts`** - Firebase configuration and initialization.
- **`auth.ts`** - Authentication utilities.

### `public/` Directory - Static Assets
- **`images/`** - Image assets organized by category.
  - **`dmx logo.png`** - Main logo used in navbar.
  - **`team/`** - Team member photos (harsh.webp, bhushan.webp, etc.).
  - **`event-files/`** - Event-related images and MDX files.
  - **`project-files/`** - Project-related images and MDX files.

### `types/` Directory - TypeScript Types
- **`index.ts`** - Global TypeScript type definitions (Event, Project, etc.).

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` to `.env.local` (if exists)
   - Add your Firebase config and other secrets

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend services (database, auth)
- **NextAuth.js** - Authentication
- **MDX** - Markdown with JSX for content
- **Lucide React** - Icon library

## File Organization Notes

- **Components** are organized by feature (e.g., `components/events/`, `components/team/`) for easy maintenance.
- **Pages** follow Next.js App Router conventions in `app/`.
- **Content** is separated from code in `content/` and `public/` for content management.
- **Images** are stored in `public/images/` with subfolders by type.
- **Unused Files** (as identified): Some files like `app/speakers/page.tsx`, `app/admin/page.tsx`, and auth pages are currently not linked in the navbar. The `content/events/` MDX files and `components/mdx-content.tsx` are not actively used.

## Contributing

When adding new features:
1. Place components in appropriate `components/` subfolders.
2. Add new pages in `app/` with proper routing.
3. Store images in `public/images/` with descriptive names.
4. Update this README if adding new directories or changing structure.

For questions about specific files, refer to the comments in the code or ask the original developer.
