const { WOMClient, Metric } = require('@wise-old-man/utils');

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});
const groupId = parseInt(process.argv[2], 10);
const metric = process.argv[3]?.toUpperCase() || 'OVERALL'; // Default to 'OVERALL'

if (!Metric[metric]) {
  console.error(JSON.stringify({ success: false, message: `Invalid metric: ${metric}` }));
  process.exit(1);
}

client.groups
  .getGroupHiscores(groupId, Metric[metric], { limit: 500 })
  .then((hiscores) => {
    console.log(JSON.stringify(hiscores));
  })
  .catch((error) => {
    console.error(JSON.stringify({ success: false, message: error.message }));
  });
