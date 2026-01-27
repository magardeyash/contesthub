export async function fetchAtCoderStats(username: string) {
  try {
    const response = await fetch(`https://atcoder.jp/users/${username}`, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    });

    if (response.status !== 200) return { success: false, error: "User not found" };

    const html = await response.text();

    const ratingMatch = html.match(/<span class='user-\w+'>(\d+)<\/span>/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const maxMatch = html.match(/Highest rating.+<span class='user-\w+'>(\d+)<\/span>/);
    const highestRating = maxMatch ? parseInt(maxMatch[1]) : 0;

    return { success: true, rating, highestRating };

  } catch {
    return { success: false, error: "Failed to fetch" };
  }
}