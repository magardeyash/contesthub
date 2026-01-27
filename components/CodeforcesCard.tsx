'use client'

import { addCodeforcesHandle } from '@/app/actions'
import { BarChart3, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

interface CFProps {
  data: {
    rating: number | null
    highestRating: number | null
    username: string
  } | undefined | null
}

const getRankColor = (rating: number) => {
  if (rating < 1200) return "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
  if (rating < 1400) return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500"
  if (rating < 1600) return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-500"
  if (rating < 1900) return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500"
  if (rating < 2100) return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-500"
  if (rating < 2400) return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500"
  return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-500"
}

const getRankTextColor = (rating: number) => {
  if (rating < 1200) return "text-gray-500 dark:text-zinc-400"
  if (rating < 1400) return "text-green-600 dark:text-green-500"
  if (rating < 1600) return "text-cyan-600 dark:text-cyan-500"
  if (rating < 1900) return "text-blue-600 dark:text-blue-500"
  if (rating < 2100) return "text-purple-600 dark:text-purple-500"
  if (rating < 2400) return "text-yellow-600 dark:text-yellow-500"
  return "text-red-600 dark:text-red-500"
}

export function CodeforcesCard({ data }: CFProps) {
  const [isOpen, setIsOpen] = useState(!data)
  const [username, setUsername] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await addCodeforcesHandle(username)
      if (res.success) setIsOpen(false)
      else alert(res.message)
    })
  }

  if (isOpen) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500">
            <UserIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Link Codeforces</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">Show off your rank colors.</p>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input 
            type="text" 
            placeholder="username"
            className="flex-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 outline-none ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={isPending}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isPending ? '...' : 'Link'}
          </button>
        </form>
      </div>
    )
  }

  const colorClass = getRankColor(data?.rating || 0)
  const textColorClass = getRankTextColor(data?.rating || 0)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className={`absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20 ${textColorClass.replace('text-', 'bg-')}`} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Codeforces</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className={`text-4xl font-black ${textColorClass}`}>
              {data?.rating}
            </h2>
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">MAX {data?.highestRating}</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-gray-400 dark:text-zinc-500">@{data?.username}</p>
        </div>
        <div className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 ${colorClass}`}>
          <BarChart3 className="h-6 w-6" />
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className="relative mt-5 text-xs font-bold text-gray-400 hover:text-blue-600 dark:text-zinc-600 dark:hover:text-blue-500"
      >
        Change Handle
      </button>
    </div>
  )
}