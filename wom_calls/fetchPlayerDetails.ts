const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchPlayerDetails(username: string) {
  const playerDetails = await client.players.getPlayerDetails(username);
  console.log(JSON.stringify(playerDetails));
};
