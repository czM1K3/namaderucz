import {
	validate,
	validateArray,
	required,
	isString,
	validateObject,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

export default (input: Record<string, unknown>) =>
	validate(input, {
		domains: validateArray(true, [
			required,
			...validateObject(true, {
				name: [required, isString],
				assets: validateArray(true, [required, isString]),
			}),
		]),
	});
