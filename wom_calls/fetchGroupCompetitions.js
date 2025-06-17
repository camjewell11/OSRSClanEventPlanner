const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});
const groupId = process.argv[2];

client.groups
  .getGroupCompetitions(groupId)
  .then((competitions) => {
    console.log(JSON.stringify(competitions));
  })
  .catch((error) => {
    console.error(JSON.stringify({ success: false, message: error.message }));
  });
