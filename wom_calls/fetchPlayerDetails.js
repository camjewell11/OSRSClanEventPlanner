const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

const fetchPlayerDetails = async (username) => {
  try {
    const playerDetails = await client.players.getPlayerDetails(username);
    console.log(JSON.stringify(playerDetails));
  } catch (error) {
    console.error(error.message || 'An error occurred while fetching player details.');
    process.exit(1);
  }
};

// Get the player ID from the command-line arguments
const username = process.argv[2];
if (!username) {
  console.error('Player username is required as an argument.');
  process.exit(1);
}

fetchPlayerDetails(username);
