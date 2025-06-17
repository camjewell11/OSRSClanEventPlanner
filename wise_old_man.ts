import { serve } from "bun";
import { spawn } from "child_process";
import { config } from "dotenv";
config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const WISE_OLD_MAN_API_KEY = process.env.WISE_OLD_MAN_API_KEY;
const WOM_GROUP_ID = process.env.WOM_GROUP_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !SECRET_KEY || !WISE_OLD_MAN_API_KEY || !WOM_GROUP_ID) {
  throw new Error("One or more required environment variables are missing.");
}

function runNodeScript(script: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [script, ...args], {
      env: { ...process.env, WOM_API_KEY: WISE_OLD_MAN_API_KEY },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (data) => (stdout += data));
    proc.stderr.on("data", (data) => (stderr += data));
    proc.on("close", (code) => {
      if (code !== 0) reject(stderr.trim());
      else resolve(stdout.trim());
    });
  });
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve({
  async fetch(req: Request, server) {
    const url = new URL(req.url);
    try {
      // /api/wom/group/
      if (url.pathname === "/api/wom/group/" && req.method === "GET") {
        const script = "./wom_calls/fetchGroupDetails.js";
        const result = await runNodeScript(script, [WOM_GROUP_ID]);
        const group = JSON.parse(result);
        group.memberships = (group.memberships || []).map((m: any) => ({
          displayName: m.player.displayName,
          playerId: m.player.id,
          type: m.player.type,
          role: m.role,
        }));
        return json({ success: true, message: group }, 200);
      }

      // /api/wom/group/competitions/
      if (url.pathname === "/api/wom/group/competitions/" && req.method === "GET") {
        const script = "./wom_calls/fetchGroupCompetitions.js";
        const result = await runNodeScript(script, [WOM_GROUP_ID]);
        const competitions = JSON.parse(result);
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
        const competitionId = compMatch[1];
        const script = "./wom_calls/fetchCompetitionDetails.js";
        const result = await runNodeScript(script, [competitionId]);
        const details = JSON.parse(result);
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
        const script = "./wom_calls/fetchGroupHighscores.js";
        const result = await runNodeScript(script, [WOM_GROUP_ID, metric]);
        const highscores = JSON.parse(result);
        return json({ success: true, message: highscores }, 200);
      }

      // /api/wom/player/:username/
      const playerMatch = url.pathname.match(/^\/api\/wom\/player\/([^/]+)\/$/);
      if (playerMatch && req.method === "GET") {
        const username = playerMatch[1];
        const script = "./wom_calls/fetchPlayerDetails.js";
        const result = await runNodeScript(script, [username]);
        const player = JSON.parse(result);
        return json({ success: true, player }, 200);
      }

      // Not found
      return json({ success: false, message: "Not found" }, 404);
    } catch (e: any) {
      return json({ success: false, message: `Error: ${e}` }, 500);
    }
  },
  port: 3001,
});