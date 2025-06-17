import { WOMClient } from '@wise-old-man/utils';

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchGroupDetails(groupId: string) {
  return await client.groups.getGroupDetails(Number(groupId));
}