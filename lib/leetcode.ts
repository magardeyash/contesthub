export async function fetchLeetCodeStats(username: string) {
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
        topPercentage
        globalRanking
        attendedContestsCount
      }
      userContestRankingHistory(username: $username) {
        rating
        contest {
          startTime
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      }),
      next: { revalidate: 3600 }
    });

    const data = await response.json();

    if (data.errors) {
      return { success: false, error: "User not found" };
    }

    const info = data.data.userContestRanking;
    
    if (!info) {
      return { 
        success: true, 
        rating: 0, 
        topPercentage: 0, 
        attended: 0 
      };
    }

    return {
      success: true,
      rating: Math.round(info.rating),
      topPercentage: info.topPercentage,
      globalRanking: info.globalRanking,
      attended: info.attendedContestsCount
    };

  } catch (error) {
    console.error("LeetCode Fetch Error:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}