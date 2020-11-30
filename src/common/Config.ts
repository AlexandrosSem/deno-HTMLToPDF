import { config } from 'https://deno.land/x/dotenv/mod.ts';
const _Config = config({ path: './settings.env' });

const _LISTEN_HTTP_PORT = parseInt(_Config.LISTEN_HTTP_PORT, 10);

export const getExampleConfig = () => `
LISTEN_HTTP_PORT=8080
`;

export const env = Object.freeze({
	LISTEN_HTTP_PORT: _LISTEN_HTTP_PORT ? _LISTEN_HTTP_PORT : 8080,
});

export const PublicPath = `${Deno.cwd()}/src/client/public`;
