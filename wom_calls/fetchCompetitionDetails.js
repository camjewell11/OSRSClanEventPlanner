const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});
const competitionId = process.argv[2];

client.competitions
  .getCompetitionDetails(competitionId)
  .then((competitionDetails) => {
    console.log(JSON.stringify(competitionDetails));
  })
  .catch((error) => {
    console.error(JSON.stringify({ success: false, message: error.message }));
  });
