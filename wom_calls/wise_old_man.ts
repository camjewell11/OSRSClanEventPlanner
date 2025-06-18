import { config } from "dotenv";
import { fetchPlayerDetails } from "./fetchPlayerDetails.ts";
import { fetchGroupDetails } from "./fetchGroupDetails.ts";
import { fetchGroupCompetitions } from "./fetchGroupCompetitions.ts";
import { fetchCompetitionDetails } from "./fetchCompetitionDetails.ts";
import { fetchGroupHighscores } from "./fetchGroupHighscores.ts";
config();

const WISE_OLD_MAN_API_KEY = process.env.WISE_OLD_MAN_API_KEY;
const WOM_GROUP_ID = process.env.WOM_GROUP_ID;

if (!WISE_OLD_MAN_API_KEY || !WOM_GROUP_ID) {
  throw new Error("Missing WISE_OLD_MAN_API_KEY or WOM_GROUP_ID in .env");
}

console.log("WISE_OLD_MAN_API_KEY loaded:", !!WISE_OLD_MAN_API_KEY,  "WOM_GROUP_ID loaded:", !!WOM_GROUP_ID);
console.log("WISE_OLD_MAN_API_KEY:", WISE_OLD_MAN_API_KEY, "WOM_GROUP_ID:", WOM_GROUP_ID);

type MembershipSummary = {
  displayName: string;
  playerId: number;
  type: string;
  role: string;
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleWiseOldManApi(req: Request) {
  const url = new URL(req.url);
  try {
    // /api/wom/group/
    if (url.pathname === "/api/wom/group/" && req.method === "GET") {
      const group = await fetchGroupDetails(WOM_GROUP_ID!);
      const memberships: MembershipSummary[] = (group.memberships || []).map((m: any) => ({
        displayName: m.player.displayName,
        playerId: m.player.id,
        type: m.player.type,
        role: m.role,
      }));
      return json({ success: true, message: { ...group, memberships } }, 200);
    }

    // /api/wom/group/competitions/
    if (url.pathname === "/api/wom/group/competitions/" && req.method === "GET") {
      const competitions = await fetchGroupCompetitions(WOM_GROUP_ID!);
      const now = new Date();
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const filtered = competitions.filter((c: any) => {
        if (!c.endsAt || !c.startsAt || !c.title) return false;
        const endsAt = new Date(c.endsAt);
        return endsAt >= fourteenDaysAgo;
      }).map((c: any) => ({
        id: c.id,
        title: c.title,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      }));
      return json({ success: true, competitions: filtered }, 200);
    }

    // /api/wom/competition/:id/
    const compMatch = url.pathname.match(/^\/api\/wom\/competition\/(\d+)\/$/);
    if (compMatch && req.method === "GET") {
      const competitionId = compMatch[1]!;
      const details = await fetchCompetitionDetails(competitionId);
      const participants = (details.participations || []).map((p: any) => ({
        displayName: p.player.displayName,
        gained: p.progress.gained,
        start: p.progress.start ?? "N/A",
        end: p.progress.end ?? "N/A",
      }));
      const responseData = {
        id: details.id,
        title: details.title,
        startsAt: details.startsAt,
        endsAt: details.endsAt,
        participants,
      };
      return json({ success: true, competition: responseData }, 200);
    }

    // /api/wom/group/highscores/
    if (url.pathname === "/api/wom/group/highscores/" && req.method === "GET") {
      const metric = url.searchParams.get("metric") || "overall";
      const highscores = await fetchGroupHighscores(WOM_GROUP_ID!, metric);
      return json({ success: true, message: highscores }, 200);
    }

    // /api/wom/player/:username/
    const playerMatch = url.pathname.match(/^\/api\/wom\/player\/([^/]+)\/?$/);
    if (playerMatch && req.method === "GET") {
      const username = decodeURIComponent(playerMatch[1]!);
      const player = await fetchPlayerDetails(username);
      return json({ success: true, player }, 200);
    }

    // Not found
    return json({ success: false, message: "Not found" }, 404);
  } catch (e: any) {
    return json({ success: false, message: `Error: ${e}` }, 500);
  }
}