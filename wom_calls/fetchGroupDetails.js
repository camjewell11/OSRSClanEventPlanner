const { WOMClient } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});
const groupId = process.argv[2];

client.groups
  .getGroupDetails(groupId)
  .then((group) => {
    console.log(JSON.stringify(group));
  })
  .catch((error) => {
    console.error(JSON.stringify({ success: false, message: error.message }));
  });
