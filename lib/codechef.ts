export async function fetchCodeChefStats(username: string) {
  try {
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (response.status !== 200) return { success: false, error: "User not found" };

    const html = await response.text();

    const ratingMatch = html.match(/<div class="rating-number">(\d+?)<\/div>/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const starsMatch = html.match(/<span class="rating">(\d).?<\/span>/); 
    const stars = starsMatch ? parseInt(starsMatch[1]) : 0;

    return { success: true, rating, stars };

  } catch {
    return { success: false, error: "Failed to fetch" };
  }
}