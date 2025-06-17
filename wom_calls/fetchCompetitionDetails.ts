import { WOMClient } from '@wise-old-man/utils';

const client = new WOMClient({
  apiKey: process.env.WOM_API_KEY,
  userAgent: "ThePrestiege"
});

export async function fetchCompetitionDetails(competitionId: string) {
  return await client.competitions.getCompetitionDetails(Number(competitionId));
}