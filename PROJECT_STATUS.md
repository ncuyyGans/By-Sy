# By-Sy — Project Status & Handoff

Last updated: 25 September 2026 (Asia/Jakarta)

This document is the operational handoff for **By-Sy**, a personal website and blog for Sy. It records the current architecture, completed features, required configuration, known verification state, open risks, and a safe path for future work.

## 1. Product direction

By-Sy is a personal journal rather than a portfolio-first website. Its content types are:

- Personal stories and experiences
- Opinions and thoughts
- Learning notes
- Photos and visual posts

The public visual direction is intentionally close to `saugi.me`: restrained, readable, light by default, with a narrow content column, simple navigation, clear typography, and limited decoration.

Public pages currently planned and implemented:

- `/` — personal introduction, social links, recent writing
- `/blog` — published writing archive
- `/blog/[slug]` — article detail

Private pages:

- `/admin/login` — email/password login
- `/admin` — article list and site settings
- `/admin/posts/new` — create an article
- `/admin/posts/[id]` — edit an article

Admin routes are deliberately not linked from public navigation.

## 2. Repository and deployment

- Repository: `https://github.com/ncuyyGans/By-Sy`
- Primary branch: `main`
- Production: `https://by-sy.vercel.app`
- Hosting: Vercel
- Backend: Supabase
- Public redesign baseline before this handoff document: `e739e145dca48a3546f80802cc4dd2f86f7e2058`

Vercel is connected to the GitHub repository and automatically deploys changes pushed to `main`.

## 3. Technology stack

- Next.js 15 App Router
- React 19
- TypeScript with strict mode
- Custom global CSS; no UI framework
- `@supabase/ssr`
- `@supabase/supabase-js`
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Vercel

Dependencies are now locked in `package-lock.json`. Use Node.js 22+ and `npm ci`. CI runs tests, TypeScript checking, and the production build on pull requests and main.

## 4. Architecture

### 4.1 Public rendering

Public pages are React Server Components. They read published content through the server-side Supabase client.

Primary files:

- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `components/site-header.tsx`
- `lib/data.ts`
- `lib/supabase/server.ts`

Public data functions:

- `getPublishedPosts()` — reads rows where `status = 'published'`
- `getPostBySlug(slug)` — reads one published article
- `getSiteSettings()` — reads the singleton site profile row
- `formatDate()` — Indonesian date formatting
- `readingTime()` — simple word-count estimate

Public pages use `revalidate = 60`. Admin mutations also call `revalidatePath()` for `/` and `/blog`.

### 4.2 Authentication and route protection

Authentication uses Supabase email/password.

Primary files:

- `middleware.ts`
- `lib/supabase/middleware.ts`
- `lib/supabase/server.ts`
- `app/admin/actions.ts`
- `app/admin/login/page.tsx`

The middleware matches `/admin/:path*`:

- Unauthenticated visitors are redirected to `/admin/login`.
- Authenticated visitors opening `/admin/login` are redirected to `/admin`.
- Session cookies are refreshed using `@supabase/ssr`.

Server actions call `supabase.auth.getUser()` before protected mutations.

### 4.3 Admin CMS

Primary files:

- `app/admin/page.tsx`
- `app/admin/posts/new/page.tsx`
- `app/admin/posts/[id]/page.tsx`
- `app/admin/actions.ts`
- `components/admin-shell.tsx`
- `components/post-form.tsx`

Supported post operations:

- Create
- Edit
- Delete
- Save as draft
- Publish
- Set title, slug, excerpt, category, cover, and body
- Preserve the first publication timestamp when editing a published article

Supported site settings:

- Display name
- Role/headline
- Short biography
- Location
- Public email
- GitHub URL
- Instagram URL
- X/Twitter URL
- Footer text

### 4.4 Rich article editor

Primary files:

- `components/rich-text-editor.tsx`
- `components/post-form.tsx`
- `app/editor.css`

The editor is a lightweight browser `contentEditable` implementation. It currently supports:

- Paragraph
- Heading 2
- Heading 3
- Bold
- Italic
- Blockquote
- Unordered list
- Link
- Inline image upload

Article HTML is stored in `posts.body`. Older plain-text posts are converted into paragraph HTML when opened in the editor. The public article page detects HTML and renders it.

Known technical limitation: the editor uses `document.execCommand`, which is deprecated but still broadly supported. It is acceptable as an initial implementation, but a mature editor such as TipTap/Lexical should replace it if editing requirements grow.

Article HTML is sanitized with an explicit `sanitize-html` allowlist in `lib/article-html.ts`: before create/update, public rendering (including legacy rows), and passing stored content to the editor. Plain-text articles are escaped and converted into paragraphs. Inline styles, scripts, embeds, event handlers and unsafe URL schemes are removed. Authorization still assumes trusted admins; this does not replace an explicit role model.

### 4.5 Media upload

Primary files:

- `components/cover-uploader.tsx`
- `components/rich-text-editor.tsx`
- `lib/upload-image.ts`
- `lib/supabase/client.ts`

Images are uploaded from the authenticated browser to the public Supabase Storage bucket `blog-media`.

Rules currently expected:

- Images only: JPEG, PNG, WEBP, GIF
- Maximum size: 10 MB
- Stored under a path prefixed by the authenticated user ID
- Public read
- Authenticated insert/update/delete

The database stores public media URLs. Deleting an image reference from a post does not yet remove the corresponding Storage object, so orphan cleanup is not implemented.

## 5. Database model

### 5.1 `public.posts`

Relevant columns:

- `id uuid` — primary key
- `slug text` — unique, required
- `title text` — required
- `excerpt text`
- `category text` — one of `Cerita`, `Opini`, `Catatan Belajar`, `Visual`
- `body text`
- `cover_url text`
- `status text` — `draft` or `published`
- `published_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

RLS intent:

- Public clients can read only published posts.
- Authenticated users can manage all posts.

### 5.2 `public.site_settings`

A singleton row with `id = 1`.

Relevant columns:

- `name`
- `intro`
- `email`
- `footer`
- `role`
- `location`
- `github_url`
- `instagram_url`
- `x_url`
- `updated_at`

RLS intent:

- Public clients can read settings.
- Authenticated users can manage settings.

### 5.3 Storage

Expected bucket:

- `blog-media`

The bucket is public for reads. Storage write policies are restricted to the `authenticated` role.

## 6. Migration order

For a fresh Supabase project, run the files in this exact order through Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/migrations/002_admin_cms.sql`
3. `supabase/migrations/003_profile_fields.sql`
4. `supabase/migrations/004_media_storage.sql`

Do not paste secret keys into SQL files or commit them to Git.

After migrations, verify:

- Table Editor contains `posts` and `site_settings`.
- `site_settings` contains row `id = 1`.
- Storage contains the `blog-media` bucket.
- RLS is enabled on `posts` and `site_settings`.
- The expected policies exist for tables and Storage.

## 7. Environment configuration

Required public environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Configure them in Vercel for Production, Preview, and Development as appropriate.

Never expose any of the following through `NEXT_PUBLIC_*`:

- `service_role`
- `SUPABASE_SECRET_KEY`
- `sb_secret_...`
- Database passwords

The code expects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, not the older `NEXT_PUBLIC_SUPABASE_ANON_KEY` name.

A local setup should use `.env.local`, which is ignored by Git:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Production build command:

```bash
npm run build
```

## 8. Authentication setup

The current system assumes a deliberately created admin user in:

`Supabase Dashboard → Authentication → Users`

There is no public sign-up page. This is intentional.

Current authorization model: any authenticated Supabase user can manage posts and settings because RLS grants the `authenticated` role. Therefore:

- Do not enable unrestricted public sign-up.
- Do not create untrusted Supabase Auth users.
- If multiple user roles are introduced, add an explicit admin allowlist/profile table and update RLS before inviting them.

## 9. Completed features

- Next.js project scaffolded from an initially empty repository
- Responsive public homepage
- Published writing archive
- Article detail route
- Indonesian date and reading-time presentation
- Supabase-backed posts
- Draft/published workflow
- Email/password admin login
- Admin middleware protection
- Create, edit, and delete article flows
- Editable site profile and social links
- Supabase RLS policies
- Supabase Storage migration
- Cover image upload
- Inline image upload
- Lightweight rich-text editor
- Public rendering of rich article content
- Vercel/GitHub automatic deployment
- Minimal light visual design with Saugi-inspired proportions

## 10. Verified during implementation

The following items have direct confirmation from implementation activity or user testing:

- The repository was initially empty and accepts commits on `main`.
- The initial public scaffold successfully deployed to Vercel.
- Vercel detected Next.js `15.5.26` during a production build.
- A production build initially failed because Supabase cookie handlers had an implicit `any`; this was fixed using explicit `CookieOptions` typing.
- After that fix, the user confirmed the site/admin flow was working.
- `/admin/login` became reachable after the successful CMS deployment.
- The public site served the Supabase-backed redesign at `by-sy.vercel.app`.
- The `posts` table was reported as visible in Supabase.

## 11. Not yet confirmed

These items must be smoke-tested before being treated as complete:

- Production functional smoke tests remain pending. GitHub reports Vercel deployment success for main commit `c543525660316eb50921156cc2fbc4f37c063879` (24 September 2026).
- Migration `003_profile_fields.sql` has been run successfully.
- Migration `004_media_storage.sql` has been run successfully.
- The `blog-media` bucket appears in Supabase Storage.
- Cover upload succeeds in production.
- Inline image upload succeeds in production.
- Uploaded files render publicly from their Storage URLs.
- Creating, editing, publishing, and deleting a post all work after the newest UI changes.
- Site profile/social settings save successfully after migration 003.
- Rich HTML persists correctly after reopening an article.
- Editor output renders correctly on mobile.
- Duplicate slug errors have a sufficiently friendly UI.
- Failed database/settings mutations are surfaced consistently; some settings paths currently redirect without displaying the Supabase error.
- Accessibility has not received a formal audit.
- SEO metadata, sitemap, RSS, Open Graph images, and structured data are not implemented.
- GitHub execution of the new CI workflow must be checked on the pull request; local tests and build pass.

## 12. Known issues and technical debt

1. **Dependency updates**
   - Lockfile added; keep it updated intentionally and use `npm ci`.

2. **HTML policy**
   - Server-side allowlist added and regression-tested.
   - Future editor features must update the policy and tests together.

3. **Deprecated editor API**
   - `document.execCommand` should eventually be replaced.

4. **Orphaned media**
   - Removing an image from content does not delete it from Storage.

5. **Broad authenticated authorization**
   - Any authenticated Supabase account has CMS permissions.

6. **Error handling**
   - Some server actions do not expose database errors to the admin UI.

7. **No autosave or revision history**
   - Long edits can be lost if the page closes before submission.

8. **No image processing**
   - Images are not resized, compressed, or given generated responsive variants.

9. **No preview route**
   - Drafts cannot yet be previewed as the public article page.

10. **CSS is global**
    - Public and admin systems share global primitives; changes should be regression-tested on both surfaces.

## 13. Safe continuation procedure

Use this sequence for future updates:

1. Pull the latest `main` and inspect `PROJECT_STATUS.md` plus the newest commits.
2. Confirm all four Supabase migrations have been applied before debugging application code.
3. Confirm Vercel has the two expected public environment variables.
4. Create a feature branch instead of pushing an untested large change directly to `main`.
5. Run locally:

   ```bash
   npm install
   npm run build
   ```

6. Commit the generated `package-lock.json` after the first known-good clean build.
7. Test locally with a non-production Supabase project when making destructive schema or Storage changes.
8. For database changes, add a new numbered migration. Never edit an already-applied migration as the only record of a new change.
9. Keep migrations idempotent where practical with `if exists`, `if not exists`, and explicit policy replacement.
10. Open a pull request and review the Vercel Preview deployment.
11. Smoke-test public and private paths before merging.
12. Merge to `main` only after Preview is good.
13. Verify the Production deployment becomes `Ready` and check Vercel logs.
14. Update this handoff document with the final verification state and new migration requirements.

## 14. Required smoke-test checklist

### Public

- [ ] `/` loads without console/server errors
- [ ] Name, role, bio, location, and social links are correct
- [ ] Empty post state renders correctly
- [ ] Published posts appear in recent writing
- [ ] `/blog` shows only published posts
- [ ] `/blog/[slug]` renders headings, lists, links, quotes, and images
- [ ] Layout is usable on desktop and mobile

### Authentication

- [ ] `/admin` redirects logged-out visitors to `/admin/login`
- [ ] Correct email/password logs in
- [ ] Incorrect credentials show an error
- [ ] Logout clears the session
- [ ] Logged-in visits to `/admin/login` redirect to `/admin`

### CMS

- [ ] Create draft
- [ ] Publish draft
- [ ] Edit published post
- [ ] Delete post
- [ ] Duplicate slug displays an understandable error
- [ ] Profile and social settings save
- [ ] Public pages update after save

### Media/editor

- [ ] Cover upload accepts a valid image
- [ ] Invalid and oversized files are rejected
- [ ] Inline image upload inserts the image into the editor
- [ ] Rich formatting survives save and reopen
- [ ] Public article renders stored HTML correctly
- [ ] Storage URLs remain publicly readable after logout

## 15. Recommended next milestones

Recommended order:

1. Complete and record the smoke test above.
2. Lockfile and CI build check implemented; verify hosted CI.
3. HTML sanitization implemented; smoke-test real saved content on Preview.
4. Add draft preview.
5. Add autosave and unsaved-change warning.
6. Add image compression/resize and media cleanup.
7. Improve admin mutation error handling.
8. Add per-post SEO, sitemap, RSS, and Open Graph metadata.
9. Add an explicit admin role model if more users are introduced.
10. Replace the lightweight editor only when its limitations become material.

## 16. Guardrails

- Never commit Supabase keys, database passwords, or Vercel secrets.
- Never put secret/service-role credentials in `NEXT_PUBLIC_*`.
- Do not disable RLS to fix an application issue.
- Do not enable public sign-up under the current broad authenticated policies.
- Do not delete or recreate the production Storage bucket without backing up media URLs.
- Do not run destructive SQL against production without a backup and a reviewed migration.
- Preserve compatibility with existing plain-text posts while rich HTML posts remain in the same `body` column.
- Keep `/admin` absent from public navigation even though it is protected.

## 17. Continuation — 25 September 2026

Scope: build reproducibility and article HTML safety, on a feature branch for review.

- Added lockfile, regression tests, TypeScript script and GitHub Actions CI.
- Replaced the obsolete `next lint` script with the explicit `typecheck` command.
- Added server-side HTML allowlist to writes, public output and editor initial content.
- Corrected README migration order to include profile fields and media storage.
- Local verification: five regression tests pass, TypeScript passes, Next.js 15.5.26 production build succeeds without production credentials.
- No database migration, production mutation, merge or production deployment performed in this continuation.
- Authenticated CMS/media smoke tests and Supabase migration state remain unverified because this workspace has no configured Supabase environment or admin session.
- Next product milestone after Preview verification: draft preview, followed by unsaved-change protection.
