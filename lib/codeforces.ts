export async function fetchCodeforcesStats(username: string) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      return { success: false, error: "User not found" };
    }

    const info = data.result[0];

    return {
      success: true,
      rating: info.rating || 0,
      maxRating: info.maxRating || 0,
      rank: info.rank || "unrated", 
      avatar: info.titlePhoto
    };

  } catch (error) {
    console.error("Codeforces Fetch Error:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}