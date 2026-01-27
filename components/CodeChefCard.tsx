'use client'

import { addCodeChefHandle } from '@/app/actions'
import { Star, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

interface CodeChefProps {
  data: {
    rating: number | null
    highestRating: number | null
    username: string
  } | undefined | null
}

export function CodeChefCard({ data }: CodeChefProps) {
  const [isOpen, setIsOpen] = useState(!data)
  const [username, setUsername] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    startTransition(async () => {
      const res = await addCodeChefHandle(username); 
      if (res.success) {
        setIsOpen(false)
      } else {
        alert(res.message)
      }
    })
  }

  if (isOpen || !data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500">
              <UserIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Link CodeChef</h3>
          </div>
          {data && (
            <button onClick={() => setIsOpen(false)} className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
              Cancel
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">Track your rating on CodeChef.</p>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="username" 
            className="flex-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 outline-none ring-orange-500/20 transition-all focus:border-orange-500 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-orange-500" 
            required 
          />
          <button 
            disabled={isPending} 
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isPending ? '..' : 'Add'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-orange-900/20 dark:bg-zinc-950">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-orange-50/50 blur-3xl transition-colors group-hover:bg-orange-100/50 dark:bg-orange-900/10" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">CodeChef</p>
          <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-zinc-50">{data?.rating || 0}</h2>
          
          <div className="flex items-center text-orange-600 mt-2">
            <div className="flex">
              {Array.from({ length: Math.min(Number(data?.highestRating) || 1, 7) }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-400 dark:text-zinc-500">@{data?.username}</span>
          </div>
        </div>
        <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-900/30 dark:text-orange-500">
          <Star className="h-6 w-6" />
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className="relative mt-5 text-xs font-bold text-gray-400 hover:text-orange-600 dark:text-zinc-600 dark:hover:text-orange-500"
      >
        Change Handle
      </button>
    </div>
  )
}
