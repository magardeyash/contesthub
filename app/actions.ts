'use server'

import { fetchLeetCodeStats } from '@/lib/leetcode'
import { prisma } from '@/lib/prisma'
import { Prisma, Handle } from '@/generated/prisma'
import { revalidatePath, unstable_cache, revalidateTag } from 'next/cache'
import { fetchCodeforcesStats } from '@/lib/codeforces'
import { fetchAtCoderStats } from '@/lib/atcoder'
import { fetchCodeChefStats } from '@/lib/codechef'
import { auth, currentUser } from '@clerk/nextjs/server'

const RESOURCE_IDS = "1,2,102,93"

export async function syncContests() {
  const username = process.env.CLIST_USERNAME
  const apiKey = process.env.CLIST_API_KEY

  if (!username || !apiKey) {
    return { success: false, message: "API Keys missing in .env" }
  }

  try {
    const today = new Date().toISOString()
    const response = await fetch(
      `https://clist.by/api/v4/contest/?upcoming=true&start__gte=${today}&resource_id__in=${RESOURCE_IDS}&limit=50&order_by=start`,
      {
        method: "GET",
        headers: {
          "Authorization": `ApiKey ${username}:${apiKey}`
        },
        cache: "no-store"
      }
    )

    if (!response.ok) {
      throw new Error(`Clist API Error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Clist API sync started. Found", data.objects.length, "contests.");

    interface ClistContest {
      resource_id?: number;
      resource?: { id: number };
      start?: string;
      start_time?: string;
      event: string;
      href?: string;
      url?: string;
      duration: number;
    }

    const contests = data.objects.map((c: ClistContest) => {
      const resId = c.resource_id || c.resource?.id
      const platform = mapResourceToPlatform(resId)

      const rawStart = c.start || c.start_time
      if(!rawStart) return null
      const normalizedStart = rawStart.includes('T')
        ? rawStart
        : rawStart.replace(' ', 'T')

      const utcStart = normalizedStart.endsWith('Z')
        ? normalizedStart
        : normalizedStart + 'Z'

      return {
        title: c.event,
        url: c.href || c.url,
        startTime: new Date(utcStart),
        duration: c.duration,
        platform
      }
    })


    for (const contest of contests) {
      await prisma.contest.upsert({
        where: { url: contest.url },
        update: { 
          startTime: contest.startTime,
          duration: contest.duration,
          title: contest.title,
          platform: contest.platform 
        },
        create: contest,
      })
    }
    
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    await prisma.contest.deleteMany({
      where: { startTime: { lt: yesterday } }
    })

    revalidatePath('/')
    revalidateTag('contests', 'layout')
    return { success: true, message: `Synced ${contests.length} contests!` }

  } catch (error) {
    console.error("Sync Error:", error)
    return { success: false, message: "Failed to fetch from Clist." }
  }
}

export const getContests = unstable_cache(
  async (platform?: string) => {
    const whereClause: Prisma.ContestWhereInput = {
      startTime: {
        gte: new Date()
      }
    }
    if (platform && platform !== 'ALL') {
      whereClause.platform = platform
    }

    return await prisma.contest.findMany({
      orderBy: { startTime: 'asc' },
      where: whereClause
    })
  },
  ['contests-list'],
  { revalidate: 3600, tags: ['contests'] }
)

function mapResourceToPlatform(id: string | number | undefined): string {
  switch(Number(id)) {
    case 1: return "CODEFORCES";
    case 2: return "CODECHEF";
    case 102: return "LEETCODE";
    case 93: return "ATCODER";
    default: return "OTHER";
  }
}

async function getOrCreateUser() {
  const { userId } = await auth()
  if (!userId) return null

  let user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    user = await prisma.user.create({
      data: { 
        id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null
      }
    })
  }
  return user
}

export async function addLeetCodeHandle(username: string) {
  try {
    const stats = await fetchLeetCodeStats(username)
    if (!stats.success) return { success: false, message: "Invalid LeetCode Username" }

    const user = await getOrCreateUser()
    if (!user) return { success: false, message: "Unauthorized" }

    await prisma.handle.upsert({
      where: { id: `leetcode-${user.id}` }, 
      create: {
        id: `leetcode-${user.id}`,
        platform: "LEETCODE",
        username: username,
        rating: stats.rating || 0,
        userId: user.id
      },
      update: {
        username: username,
        rating: stats.rating || 0,
      }
    })

    revalidatePath('/')
    return { success: true, message: "Profile linked successfully!" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Database Error" }
  }
}

export async function addCodeforcesHandle(username: string) {
  try {
    const stats = await fetchCodeforcesStats(username)
    if (!stats.success) return { success: false, message: "Invalid Codeforces Handle" }

    const user = await getOrCreateUser()
    if (!user) return { success: false, message: "Unauthorized" }

    await prisma.handle.upsert({
      where: { id: `codeforces-${user.id}` }, 
      create: {
        id: `codeforces-${user.id}`,
        platform: "CODEFORCES",
        username: username,
        rating: stats.rating || 0,
        highestRating: stats.maxRating || 0,
        userId: user.id
      },
      update: {
        username: username,
        rating: stats.rating || 0,
        highestRating: stats.maxRating || 0,
      }
    })

    revalidatePath('/')
    return { success: true, message: "Codeforces linked!" }
  } catch {
    return { success: false, message: "Database Error" }
  }
}

export async function addAtCoderHandle(username: string) {
  const stats = await fetchAtCoderStats(username)
  if (!stats.success) return { success: false, message: "Invalid AtCoder Handle" }

  const user = await getOrCreateUser()
  if (!user) return { success: false, message: "Unauthorized" }

  await prisma.handle.upsert({
    where: { id: `atcoder-${user.id}` },
    create: {
      id: `atcoder-${user.id}`,
      platform: "ATCODER",
      username,
      rating: stats.rating || 0,
      highestRating: stats.highestRating || 0,
      userId: user.id
    },
    update: { username, rating: stats.rating || 0, highestRating: stats.highestRating || 0 }
  })
  revalidatePath('/')
  return { success: true, message: "AtCoder linked!" }
}

export async function addCodeChefHandle(username: string) {
  const stats = await fetchCodeChefStats(username)
  if (!stats.success) return { success: false, message: "Invalid CodeChef Handle" }

  const user = await getOrCreateUser()
  if (!user) return { success: false, message: "Unauthorized" }

  await prisma.handle.upsert({
    where: { id: `codechef-${user.id}` },
    create: {
      id: `codechef-${user.id}`,
      platform: "CODECHEF",
      username,
      rating: stats.rating || 0,
      highestRating: stats.stars || 0,
      userId: user.id
    },
    update: { username, rating: stats.rating || 0, highestRating: stats.stars || 0 }
  })
  revalidatePath('/')
  return { success: true, message: "CodeChef linked!" }
}

export async function getAllUserStats() {
  const { userId } = await auth()
  if (!userId) return { leetcode: null, codeforces: null, atcoder: null, codechef: null }

  const handles = await prisma.handle.findMany({ where: { userId } })
  
  return {
    leetcode: handles.find((h: Handle) => h.platform === "LEETCODE"),
    codeforces: handles.find((h: Handle) => h.platform === "CODEFORCES"),
    atcoder: handles.find((h: Handle) => h.platform === "ATCODER"),
    codechef: handles.find((h: Handle) => h.platform === "CODECHEF"),
  }
}