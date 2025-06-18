import { sql, serve } from "bun";
import mainPage from './main.html';
import { handleWiseOldManApi } from './wom_calls/wise_old_man.ts';

console.log("Now running OSRS Event Planner!");

const results = await Bun.build({
    entrypoints: ['./frontend.tsx'],
    outdir: './build'
});

const server = serve({
    port: 3000,
    routes: {
        "/": mainPage
    },
    fetch(req) {
        const url = new URL(req.url);
        console.log("Path: " + url.pathname);

        if (url.pathname === "/bootstrap.min.css") {
            return new Response(Bun.file("./node_modules/bootstrap/dist/css/bootstrap.min.css"));
        }

        // API handler
        if (url.pathname.startsWith("/api/wom/")) {
            return handleWiseOldManApi(req);
        }

        return new Response("404 error!");
    }
});