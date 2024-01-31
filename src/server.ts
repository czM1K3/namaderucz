import { opine, serveStatic } from "https://deno.land/x/opine@2.3.4/mod.ts";
import mainHtml from "./templates/main.ts";
import assetHtml from "./templates/asset.ts";
import notFound from "./templates/notFound.ts";
import { loadConfig } from "./config.ts";

// Load initial config
let config = await loadConfig();

(async () => {
	const configWatcher = Deno.watchFs("./config/config.json", {
		recursive: false,
	});
	for await (const event of configWatcher) {
		if (event.kind === "modify") config = await loadConfig();
	}
})();

const app = opine();

app.use((req, res, next) => {
	const domain = req.get("host")!;
	const match = domain.match(/([a-z]*)\.namaderu.cz$/);
	res.locals.path = match ? (match[1] === "www" ? "" : match[1]) : "";
	res.locals.path = "example";
	next();
});

app.get("/", (_req, res) => {
	const currentDomain = config[res.locals.path];
	if (currentDomain) {
		res.send(assetHtml(currentDomain));
	} else {
		res.send(
			mainHtml(
				"Asi jsi na maděru 🤷‍♂️",
				res.locals.path ? `Ale ${res.locals.path} asi není na maděru` : null
			)
		);
	}
});

app.get("/asset/*", (req, res) => {
	const currentDomain = config[res.locals.path];
	if (!currentDomain) {
		res.status = 404;
		res.end();
		return;
	}
	const file = req.params[0];
	if (currentDomain.includes(file)) {
		const path = Deno.realPathSync(`${Deno.cwd()}/config/assets/${file}`);
		res.download(path);
	} else {
		res.status = 404;
		res.end();
	}
});

app.use(serveStatic("public"));

app.use((_req, res, _next) => {
	res.status = 404;
	res.send(notFound());
});

app.listen(3000, () =>
	console.log("server has started on http://localhost:3000 🚀")
);
