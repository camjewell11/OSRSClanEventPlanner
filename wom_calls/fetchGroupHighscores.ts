import type { Metric } from "@wise-old-man/utils";
import { WOMClient } from '@wise-old-man/utils';

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchGroupHighscores(
  groupId: string,
  metric: string = "overall"
) {
  return await client.groups.getGroupHiscores(Number(groupId), metric as Metric);
}