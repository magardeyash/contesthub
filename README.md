# ContestHub
### A Unified Competitive Programming Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

**[Live Demo](https://contesthub-rust.vercel.app/)** | **[Repository](https://github.com/magardeyash/contesthub)**

> A unified dashboard for competitive programmers to track contests and ratings across LeetCode, Codeforces, CodeChef, and AtCoder.

Managing multiple competitive programming platforms can be overwhelming—keeping track of contest schedules, remembering which platform has upcoming events, and monitoring your progress across different sites. ContestHub solves this by consolidating all contest information and platform ratings into a single, centralized dashboard.

Built with Next.js 16, React 19, and TypeScript, this application demonstrates modern full-stack development patterns including Server Actions, intelligent caching strategies, and automated data synchronization through Vercel Cron Jobs.

---

## Core Features

- **Automated Data Pipeline** – Integrated with the **CLIST API** via Vercel Cron Jobs to sync contest data daily without manual intervention.
- **Intelligent Timezone Normalization** – Automatically converts all global contest times to **IST (Asia/Kolkata)**, eliminating manual UTC offset calculations.
- **Unified Rating Tracker** – Connect your handles across multiple platforms to visualize your competitive programming statistics in one place.
- **Performance-First Architecture** – Optimized with Next.js `unstable_cache` and `revalidateTag`, achieving near-zero load times for cached data.
- **Modern UX/UI** – Built with **Tailwind CSS v4** and **React 19**, featuring a responsive design with seamless dark mode support.
- **Secure Auth Flow** – Enterprise-grade OAuth implementation using **Clerk**, supporting Google and GitHub sign-ins.

---

## Engineering Stack

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Leveraged Server Components to keep the client-side bundle light and improve SEO. |
| **Frontend** | **React 19 + TypeScript** | End-to-end type safety from DB schema to UI props, preventing runtime bugs. |
| **Styling** | **Tailwind CSS v4** | Utilized for its high-performance CSS engine and rapid responsive prototyping. |
| **Database** | **PostgreSQL + Prisma** | Chose a relational DB for data integrity between Users, Handles, and Contests. |
| **Auth** | **Clerk** | Secure session management and multi-provider OAuth with minimal overhead. |
| **Infrastructure** | **Vercel + Cron** | Automated background jobs for daily data synchronization. |

---

## Project Architecture

The codebase follows a modular structure with clear separation of concerns:

```text
contesthub/
├── app/                     # Next.js App Router (Pages, Layouts, Server Actions)
│   ├── actions.ts           # Core business logic & Server Actions
│   ├── page.tsx             # Main dashboard page (SSR)
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Tailwind v4 configuration & global styles
├── components/              # Reusable UI components (React Functional Components)
│   ├── LeetcodeCard.tsx     # Platform rating card with form handling
│   ├── CodeforcesCard.tsx   # Codeforces stats display
│   ├── AtCoderCard.tsx      # AtCoder stats display
│   ├── CodeChefCard.tsx     # CodeChef stats display
│   ├── ContestCard.tsx      # Individual contest display with IST logic
│   ├── Filters.tsx          # Client-side filter controls
│   ├── Navbar.tsx           # Auth-aware navigation with UserButton
│   ├── ThemeToggle.tsx      # Dark/light mode switcher
│   └── ThemeProvider.tsx    # Theme context provider
├── lib/                     # Utility functions & API wrappers
│   ├── prisma.ts            # Prisma Client singleton
│   ├── utils.ts             # IST date formatting & helper functions
│   ├── leetcode.ts          # LeetCode GraphQL API wrapper
│   ├── codeforces.ts        # Codeforces REST API wrapper
│   ├── atcoder.ts           # AtCoder scraper
│   └── codechef.ts          # CodeChef scraper
├── prisma/                  # Database schema & migrations
│   └── schema.prisma        # Prisma schema with User, Handle, Contest models
├── app/api/cron/            # Vercel Cron endpoints
│   └── sync-contests/       # Daily contest sync job
└── proxy.ts                 # Clerk authentication middleware
```

### Key Engineering Decisions

#### 1. Multi-Tier Caching Strategy
To minimize external API dependency and DB load, I implemented a custom caching layer:
- **Query Caching:** Used `unstable_cache` with a 1-hour TTL.
- **On-Demand Invalidation:** The cache is purged via `revalidateTag` only after the daily sync job completes, ensuring data is both fast and fresh.

#### 2. Timezone Edge Case Handling
Normalization was a significant challenge. APIs return data in various formats (Unix, ISO, UTC). I centralized the logic in `lib/utils.ts` using the `Intl.DateTimeFormat` API to ensure 100% consistency across the dashboard.

#### 3. Server Actions over REST
By using **Next.js Server Actions**, I eliminated the need for boilerplate API routes. This allows for direct, type-safe communication between the frontend and backend, simplifying state management for handle linking.

---

## Database Schema

The application uses a straightforward relational schema with three core models:

```prisma
model User {
  id       String   @id          // Clerk user ID
  email    String   @unique
  name     String?
  handles  Handle[]              // One user, many platform handles
  createdAt DateTime @default(now())
}

model Handle {
  id            String  @id
  platform      String  // LEETCODE, CODEFORCES, etc.
  username      String
  rating        Int
  highestRating Int?
  userId        String
  user          User    @relation(fields: [userId], references: [id])
}

model Contest {
  id        String   @id @default(cuid())
  title     String
  platform  String
  startTime DateTime
  duration  Int      // in seconds
  url       String   @unique
}
```

The `Handle` model maintains a foreign key relationship with `User`, ensuring user-specific platform statistics are properly isolated. Contest data is shared globally across all users.

---

## Local Development Setup

To run this project locally, follow these steps:

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/contesthub.git
cd contesthub
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up your environment**

Create a `.env` file with these keys:
```env
# Database (PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/contesthub"

# Clerk (sign up at clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_pk
CLERK_SECRET_KEY=your_sk

# CLIST API (register at clist.by)
CLIST_USERNAME=your_username
CLIST_API_KEY=your_api_key

# For production cron job
CRON_SECRET=some_random_string
```

**4. Push the database schema**
```bash
npx prisma generate
npx prisma db push
```

**5. Start the dev server**
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Automated Synchronization

The production environment uses Vercel Cron Jobs to automatically sync contest data daily at midnight UTC. Configuration is defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-contests",
      "schedule": "0 0 * * *"
    }
  ]
}
```

The endpoint validates a `CRON_SECRET` in the authorization header for security. For local development and testing, you can manually trigger the sync:

```bash
curl -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/sync-contests
```

---

## Technical Implementation Details

### Multi-Layer Caching Strategy

Performance optimization was a key consideration. The application needed to remain responsive while minimizing unnecessary external API calls. I implemented a multi-tier caching approach:

**Database Query Caching:**
```typescript
export const getContests = unstable_cache(
  async (platform?: string) => {
    return await prisma.contest.findMany({
      where: { platform, startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' }
    })
  },
  ['contests-list'],
  { revalidate: 3600, tags: ['contests'] }
)
```

Queries are cached for one hour. When new contests are synced, `revalidateTag('contests')` immediately purges the cache, ensuring users see fresh data.

**External API Response Caching:**
```typescript
const response = await fetch(
  `https://codeforces.com/api/user.info?handles=${username}`,
  { next: { revalidate: 3600 } }
);
```

Next.js handles this natively through the Fetch API, reducing redundant requests to external services.

### Timezone Conversion Challenge

Handling timezone conversion properly proved more complex than initially expected. The CLIST API returns timestamps in UTC, but displaying them correctly in IST (India Standard Time, UTC+5:30) required careful handling:

```typescript
export function formatInIST(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Kolkata',
    hour12: true
  }).format(new Date(date));
}
```

This utility function leverages the `Intl.DateTimeFormat` API to handle timezone conversion consistently across the application, displaying times as "Mon, Jan 27, 8:00 PM" rather than raw ISO strings.

### OAuth Integration with Clerk

Rather than building a custom authentication system, I integrated Clerk for enterprise-grade OAuth support:

```typescript
export async function addLeetCodeHandle(username: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  
  const user = await getOrCreateUser();
  // Save platform handle to database
}
```

The `auth()` function retrieves the current user's Clerk ID, which serves as the primary key in the `User` table. Protected routes are handled through Clerk's middleware, with automatic session management and token refresh.

### Server Actions Pattern

Instead of traditional REST API routes, this application uses Next.js Server Actions for server-side mutations:

```typescript
'use server'

export async function syncContests() {
  const response = await fetch(CLIST_API_URL, { ... });
  const contests = await response.json();
  
  for (const contest of contests) {
    await prisma.contest.upsert({ ... });
  }
  
  revalidateTag('contests');
}
```

This approach eliminates the boilerplate of creating separate API endpoints—functions marked with `'use server'` can be invoked directly from client components while executing securely on the server.

---

## Challenges & Learnings

- **Handling Timezone Normalization:** I learned that storing everything in UTC and converting only at the UI layer is the only way to avoid "off-by-one" day errors in global scheduling apps.
- **API Rate Limiting & Resilience:** Fetching data for hundreds of users requires careful handling of rate limits. I implemented cooldown periods and optimized the background sync to be non-intrusive.
- **Performance Profiling:** Implementing `unstable_cache` taught me how to balance data freshness with system performance, resulting in sub-50ms load times for most users.

---

*Developed with a focus on system architecture and user experience by [Yash Magarde](https://github.com/magardeyash).*
