'use client'

import { addAtCoderHandle } from '@/app/actions'
import { Terminal, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

const getAtCoderColor = (rating: number) => {
  if (rating < 400) return "text-gray-400 dark:text-gray-500"
  if (rating < 800) return "text-green-800 dark:text-green-400" 
  if (rating < 1200) return "text-green-600 dark:text-green-500"
  if (rating < 1600) return "text-cyan-500 dark:text-cyan-400"
  if (rating < 2000) return "text-blue-600 dark:text-blue-500"
  if (rating < 2400) return "text-yellow-500 dark:text-yellow-400"
  return "text-orange-500 dark:text-orange-400"
}

interface AtCoderProps {
  data: {
    rating: number | null
    username: string
  } | undefined | null
}

export function AtCoderCard({ data }: AtCoderProps) {
  const [isOpen, setIsOpen] = useState(!data)
  const [username, setUsername] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    startTransition(async () => {
      const res = await addAtCoderHandle(username); 
      if (res.success) {
         alert("Added! Refreshing...")
      }
    })
  }

  if (isOpen || !data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
            <UserIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Link AtCoder</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">Link your AtCoder account.</p>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="username" 
            className="flex-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 outline-none ring-gray-500/20 transition-all focus:border-gray-500 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500" 
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

  const colorClass = getAtCoderColor(data?.rating || 0)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-gray-50/50 blur-3xl transition-colors group-hover:bg-gray-100/50 dark:bg-zinc-800/10" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">AtCoder</p>
          <h2 className={`mt-2 text-4xl font-black ${colorClass}`}>{data?.rating || 0}</h2>
          <p className="mt-1.5 text-sm font-medium text-gray-400 dark:text-zinc-500">@{data?.username}</p>
        </div>
        <div className="rounded-xl bg-gray-100 p-2.5 text-gray-600 transition-transform group-hover:scale-110 dark:bg-zinc-800 dark:text-zinc-400">
          <Terminal className="h-6 w-6" />
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(true)}
        className="relative mt-5 text-xs font-bold text-gray-400 hover:text-gray-900 dark:text-zinc-600 dark:hover:text-zinc-300"
      >
        Change Handle
      </button>
    </div>
  )
}
