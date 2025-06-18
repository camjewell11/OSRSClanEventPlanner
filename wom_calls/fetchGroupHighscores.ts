import { WOMClient, Metric } from '@wise-old-man/utils';

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchGroupHighscores(
  groupId: string,
  metric: string = "overall",
  limit: number = 500
) {
  // Normalize metric string to match Metric enum keys
  const metricKey = metric.replace(/ /g, "_").toUpperCase();
  const metricEnum = Metric[metricKey as keyof typeof Metric];

  if (!metricEnum) {
    throw new Error(`Invalid metric: ${metric}`);
  }

  let allResults: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await client.groups.getGroupHiscores(
      Number(groupId),
      metricEnum,
      { limit, offset }
    );
    if (result && result.length > 0) {
      allResults = allResults.concat(result);
      offset += result.length;
      hasMore = result.length === limit;
    } else {
      hasMore = false;
    }
  }

  return allResults;
}