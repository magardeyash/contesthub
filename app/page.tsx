import { getContests, getAllUserStats } from '@/app/actions'
import { Contest } from '@/generated/prisma'
import { LeetcodeCard } from '@/components/LeetcodeCard'
import { CodeforcesCard } from '@/components/CodeforcesCard'
import { AtCoderCard } from '@/components/AtCoderCard'
import { CodeChefCard } from '@/components/CodeChefCard'
import { ContestCard } from '@/components/ContestCard'
import { Navbar } from '@/components/Navbar'
import { Filters } from '@/components/Filters'
import { Sparkles, LogIn } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { SignInButton } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: Props) {
  const { userId } = await auth()
  const params = await searchParams
  const platformFilter = typeof params.platform === 'string' ? params.platform : undefined

  const [contests, userStats] = await Promise.all([
    getContests(platformFilter),
    getAllUserStats()
  ])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" />
            Competitive Programming Dashboard
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight mb-4">
            Your Ultimate <span className="text-indigo-600 dark:text-indigo-500">Contest Hub</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-zinc-400 max-w-2xl">
            Track your ratings across platforms and never miss an upcoming contest. 
            All your competitive programming needs in one place.
          </p>
        </div>

        {userId ? (
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LeetcodeCard data={userStats.leetcode} />
              <CodeforcesCard data={userStats.codeforces} />
              <CodeChefCard data={userStats.codechef} />
              <AtCoderCard data={userStats.atcoder} />
          </div>
        ) : (
          <div className="mb-16 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Track Your Ratings</h2>
            <p className="mt-2 text-gray-500 dark:text-zinc-400">
              Sign in to link your platform handles and track your progress in real-time.
            </p>
            <SignInButton mode="modal">
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-500/20">
                <LogIn className="h-4 w-4" /> Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        )}

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Upcoming Contests</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Showing {contests.length} upcoming events</p>
             </div>
             <Filters />
        </div>

        {contests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 transition-colors">
            <div className="h-20 w-20 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">No contests found</h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 text-center max-w-xs px-4">
              Try adjusting your filters or sync with platforms to fetch the latest data.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contests.map((contest: Contest) => (
              <ContestCard 
                key={contest.id}
                title={contest.title}
                platform={contest.platform}
                startTime={contest.startTime}
                duration={contest.duration}
                url={contest.url}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
