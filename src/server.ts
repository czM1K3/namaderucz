import { opine } from "https://deno.land/x/opine@2.3.3/mod.ts";
import validate from "./validateConfig.ts";
import mainHtml from "./templates/main.ts";
import assetHtml from "./templates/asset.ts";
import ConfigType from "./configType.ts";
import notFound from "./templates/notFound.ts";

const config = await Deno.readTextFile("./config/config.json")
	.catch(() => {
		console.log("Error reading config file");
		Deno.exit(1);
	})
	.then((str) => {
		try {
			return JSON.parse(str) as ConfigType;
		} catch {
			console.log("Error parsing config file!");
			Deno.exit(1);
		}
	});

const [isConfigValid] = await validate(config);
if (!isConfigValid) {
	console.log("Config is not valid");
	Deno.exit(1);
}

const app = opine();

app.use((req, res, next) => {
	const domain = req.get("host")!;
	const match = domain.match(/([a-z]*)\.namaderu.cz$/);
	res.locals.path = match ? (match[1] === "www" ? "" : match[1]) : "";
	next();
});

app.get("/", (_req, res) => {
	if (config.domains.map((domain) => domain.name).includes(res.locals.path)) {
		res.send(
			assetHtml(
				config.domains.find((domain) => domain.name === res.locals.path)?.assets!
			)
		);
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
	const domain = config.domains.find(
		(domain) => domain.name === res.locals.path
	);
	if (!domain) {
		res.status = 404;
		res.end();
		return;
	}
	const file = req.params[0];
	if (domain.assets.includes(file)) {
		const path = Deno.realPathSync(`${Deno.cwd()}/config/assets/${file}`);
		res.download(path);
	} else {
		res.status = 404;
		res.end();
	}
});

app.use((_req, res, _next) => {
	res.status = 404;
	res.send(notFound());
});

app.listen(3000, () =>
	console.log("server has started on http://localhost:3000 🚀")
);
