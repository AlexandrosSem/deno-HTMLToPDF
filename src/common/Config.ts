import { config } from 'https://deno.land/x/dotenv/mod.ts';
const _Config = config({ path: './settings.env' });

const _ChromePathProgram = _Config.CHROME_PATH_PROGRAM;
const _ChromePathProfile = _Config.CHROME_PATH_PROFILE;
const _ChromeDebugWS = _Config.CHROME_DEBUG_WS; // https://chromedevtools.github.io/devtools-protocol/#endpoints

export const env = Object.freeze({
	CHROME_PATH_PROGRAM: _ChromePathProgram ? _ChromePathProgram : '',
	CHROME_PATH_PROFILE: _ChromePathProfile ? _ChromePathProfile : '',
	CHROME_DEBUG_WS: _ChromeDebugWS ? _ChromeDebugWS : '',
});

export const PublicPath = `${Deno.cwd()}/src/client/public`;
