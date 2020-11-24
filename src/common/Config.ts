import { config } from 'https://deno.land/x/dotenv/mod.ts';
const Config = config({
	path: './settings.env',
});
export default Config;
