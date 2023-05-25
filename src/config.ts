import {
	isString,
	required,
	validate,
	validateArray,
	validateObject,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

type ConfigType = {
	domains: {
		name: string;
		assets: string[];
	}[];
};

export const loadConfig = async () => {
	const configRaw = await Deno.readTextFile("./config/config.json")
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

	const [isConfigValid] = await validateConfig(configRaw);
	if (!isConfigValid) {
		console.log("Config is not valid");
		Deno.exit(1);
	}

	const config = Object.fromEntries(
		configRaw.domains.map((e) => [e.name, e.assets])
	);
	return config;
};

const validateConfig = (input: Record<string, unknown>) =>
	validate(input, {
		domains: validateArray(true, [
			required,
			...validateObject(true, {
				name: [required, isString],
				assets: validateArray(true, [required, isString]),
			}),
		]),
	});
