import {sql, serve} from "bun";
import mainPage from './main.html';

console.log("Now running OSRS Event Planner!");

const results = await Bun.build({
    entrypoints: ['./frontend.tsx'],
    outdir: './build'
});

const server = serve({
    port: 3000,
    routes:{
        "/": mainPage
    },
    fetch(req) {
        const url = new URL(req.url);
        console.log("Path: " + url.pathname);
        if (url.pathname === "/bootstrap.min.css")
        {
            return new Response(Bun.file("./node_modules/bootstrap/dist/css/bootstrap.min.css"));
        }
        return new Response("404 error!");
    }
});

