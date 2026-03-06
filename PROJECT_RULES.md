# Quizyen Web Project Rules & Architecture

## 1. Shared Infrastructure & Ecosystem
> [!IMPORTANT]
> **Shared Database**: This web application shares the SAME Supabase database and infrastructure as the **QuizFlow Mobile** project. Any database schema changes, view updates, or RLS modifications WILL directly impact both platforms.

- **Project Name**: Always use **Quizyen**. Replace any legacy "QuizFlow" references in UI, metadata, and code comments.
- **Aesthetics**: Follow "Rich Aesthetics" principles. Use harmonious color palettes (avoid plain red/blue/green), smooth gradients, and micro-animations. Glassmorphism and dark mode support are prioritized.

## 2. Data Architecture (Supabase)
### 2.1 Personalization Layer
- **`user_quizzes` & `user_folders`**: These are the authoritative stores for user-specific data (custom titles, folder assignments, last accessed times).
- **Source of Truth**: The frontend should prioritize these tables for library views and recent activity.

### 2.2 Global Immutability
- **`quizzes` & `folders`**: These are immutable creation logs. Once generated, they are never updated or deleted by regular user actions.
- **Deletions**: Deleting a quiz or folder in the UI only removes the link in `user_quizzes` or `user_folders`, preserving the global record for analytics/system history.

### 2.3 Single Folder Rule
- Each user quiz belongs to exactly one user folder (or is 'Uncategorized').

## 3. Frontend & UI/UX Standards (Next.js)
### 3.1 Component Architecture
- Use **Next.js App Router** patterns.
- Prefer **Server Components** for data fetching and **Client Components** for interactivity.
- Use **Tailwind CSS** for all styling.
- Interactive elements must have unique, descriptive IDs for testing and accessibility.

### 3.2 SEO & Performance
- **Title Tags**: Descriptive and unique per page.
- **Semantic HTML**: Use proper heading hierarchy (one `<h1>` per page).
- **Dynamic Routes**: Use `export const dynamic = 'force-dynamic';` for dashboard pages requiring fresh user data.

## 4. Coding Standards (TypeScript)
- **Strict Typing**: Avoid `any` at all costs. Use generated Supabase types (`Database['public']['Tables'][...]`) or explicit interfaces.
- **Error Handling**: Use standardized error boundaries and toast notifications for user-facing errors.

## 5. Security & RLS
- **Isolation**: All tables must have Row Level Security (RLS) enabled.
- **Policies**: Users must only be able to access/modify rows where `user_id = auth.uid()`.
- **Global Content**: `quizzes` and `folders` tables should allow shared selection but restricted insertion/modification.
