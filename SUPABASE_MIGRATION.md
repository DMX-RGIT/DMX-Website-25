# Firebase to Supabase Migration Guide (Events)

This guide is written for non-database users. Follow the steps in order.

## 1. Environment Variables

Create `.env.local` in your project root by copying [\.env.example](.env.example), then fill real values:

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Comma-separated emails allowed to open /admin
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Optional client-side check for admin layout UX
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## 2. Database Setup

1. Open Supabase SQL editor.
2. Run [supabase/events_schema.sql](supabase/events_schema.sql).
3. Create a storage bucket (optional) for event images, e.g. `events`.
4. Upload image files and store their public URL in `cover_image_url`.

Tip: if you do not want to use storage yet, keep old image paths for now (for example `/images/event-files/...`).

## 3. One-Command Data Migration from Existing MDX Files

If your old events are in `public/images/event-files/*.mdx`, run:

```powershell
npm run import:events
```

What this command does:

- Reads all MDX files in `public/images/event-files`
- Extracts frontmatter and markdown body
- Creates or updates rows in `events` table using `slug` as unique key

Field mapping done automatically:

- `slug` -> filename without `.mdx`
- `title`, `description`, `date`, `image`, `tags`, `category` -> frontmatter
- `content` -> markdown body
- `event_date` -> normalized ISO datetime
- `cover_image_url` -> `image`

## 4. Auth Migration Notes

- Firebase auth logic is removed from runtime.
- Admin area now uses NextAuth + Google sign-in.
- Server API routes validate admin by email list in `ADMIN_EMAILS`.

## 5. Events CRUD API

Implemented in [app/api/admin/events/route.ts](app/api/admin/events/route.ts):

- `GET /api/admin/events` -> list all events (admin only)
- `POST /api/admin/events` -> create event
- `PUT /api/admin/events` -> update event (requires `id`)
- `DELETE /api/admin/events?id=...` -> delete event

## 6. Frontend Behavior

- [app/events/page.tsx](app/events/page.tsx) now shows all past published events.
- Events are always ordered by latest first.
- [app/events/[slug]/page.tsx](app/events/[slug]/page.tsx) renders event details from Supabase content.
- [app/admin/events/page.tsx](app/admin/events/page.tsx) provides create/edit/delete with a clean form.

## 7. Updated Folder Structure (Relevant)

- `lib/supabase.ts` -> Supabase client factory
- `lib/events.ts` -> event data access and CRUD helpers
- `lib/admin-auth.ts` -> admin authorization checks
- `supabase/events_schema.sql` -> DB schema + policies
- `app/api/admin/events/route.ts` -> admin REST API
- `app/events/*` -> public events listing/detail pages
- `app/admin/events/page.tsx` -> admin event dashboard

## 8. Production Checklist

1. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
2. Set `ADMIN_EMAILS` in each deployment environment.
3. Ensure Google OAuth redirect includes your deployed domain.
4. Optionally move image upload workflow to Supabase Storage signed uploads.

## 9. Quick Verification (No SQL Required)

1. Start the app:

```powershell
npm run dev
```

2. Open `http://localhost:3000/events`.
3. Confirm all past events are visible and sorted newest first.
4. Open one event and verify detail page content renders.
5. Open `http://localhost:3000/admin/events`.
6. Create or edit one event and verify it appears immediately on Events page.
