import { formatDuration, formatInIST } from '@/lib/utils'
import { Calendar, Clock, ExternalLink, Globe } from 'lucide-react'
import Link from 'next/link'

interface ContestCardProps {
  title: string
  platform: string
  startTime: Date
  duration: number
  url: string
}

const getPlatformStyle = (platform: string) => {
  switch (platform.toUpperCase()) {
    case 'LEETCODE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200/50 dark:border-yellow-900/30';
    case 'CODEFORCES': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30';
    case 'CODECHEF': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/30';
    case 'ATCODER': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-700';
    default: return 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400 border-gray-200 dark:border-zinc-700';
  }
}

export function ContestCard({ title, platform, startTime, duration, url }: ContestCardProps) {
  const dateStr = formatInIST(startTime)

  const platformStyle = getPlatformStyle(platform)

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-indigo-500/10">
      <div>
        <div className="flex items-center justify-between">
          <span className={`rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${platformStyle}`}>
            {platform}
          </span>
          <Globe className="h-4 w-4 text-gray-300 dark:text-zinc-700" />
        </div>
        
        <h3 className="mt-4 text-xl font-bold leading-tight text-gray-900 dark:text-zinc-50 line-clamp-2 min-h-14 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-zinc-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-900">
              <Calendar className="h-4 w-4" />
            </div>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-zinc-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-900">
              <Clock className="h-4 w-4" />
            </div>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>

      <Link 
        href={url}
        target="_blank"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-600 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-indigo-500 dark:hover:text-white"
      >
        Register Now <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  )
}
