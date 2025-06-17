const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchPlayerDetails(username: string) {
  try {
    const playerDetails = await client.players.getPlayerDetails(username);
    return playerDetails;
  } catch (error: any) {
    console.error(error?.message || 'An error occurred while fetching player details.');
    return { error: error?.message || 'An error occurred while fetching player details.' };
  }
}