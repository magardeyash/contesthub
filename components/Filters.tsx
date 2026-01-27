'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const PLATFORMS = [
  { id: 'ALL', label: 'All Contests' },
  { id: 'LEETCODE', label: 'LeetCode' },
  { id: 'CODEFORCES', label: 'Codeforces' },
  { id: 'CODECHEF', label: 'CodeChef' },
  { id: 'ATCODER', label: 'AtCoder' },
]

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentFilter = searchParams.get('platform') || 'ALL'

  const handleFilterChange = (platformId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (platformId === 'ALL') {
      params.delete('platform')
    } else {
      params.set('platform', platformId)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2.5 mb-8">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          onClick={() => handleFilterChange(p.id)}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            currentFilter === p.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
