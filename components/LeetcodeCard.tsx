'use client'

import { addLeetCodeHandle } from '@/app/actions'
import { TrendingUp, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

interface LeetcodeCardProps {
  data: {
    username: string;
    rating: number | null;
  } | undefined | null
}

export function LeetcodeCard({ data }: LeetcodeCardProps) {
  const [isOpen, setIsOpen] = useState(!data)
  const [username, setUsername] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await addLeetCodeHandle(username)
      if (res.success) setIsOpen(false)
      else alert(res.message)
    })
  }

  if (isOpen) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500">
            <UserIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Link LeetCode</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">Track your rating progress automatically.</p>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input 
            type="text" 
            placeholder="username"
            className="flex-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 outline-none ring-yellow-500/20 transition-all focus:border-yellow-500 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-yellow-500"
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

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-yellow-900/20 dark:bg-zinc-950">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-yellow-50/50 blur-3xl transition-colors group-hover:bg-yellow-100/50 dark:bg-yellow-900/10" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">LeetCode</p>
          <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-zinc-50">{data?.rating}</h2>
          <p className="mt-1.5 text-sm font-medium text-gray-400 dark:text-zinc-500">@{data?.username}</p>
        </div>
        <div className="rounded-xl bg-yellow-100 p-2.5 text-yellow-600 transition-transform group-hover:scale-110 dark:bg-yellow-900/30 dark:text-yellow-500">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className="relative mt-5 text-xs font-bold text-gray-400 hover:text-yellow-600 dark:text-zinc-600 dark:hover:text-yellow-500"
      >
        Change Handle
      </button>
    </div>
  )
}
