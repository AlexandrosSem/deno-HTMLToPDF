import {
	env as ConfigEnv,
	PublicPath as PUBLIC_PATH,
} from './common/Config.ts';

import {
	OakApplication,
	OakRouter,
	OakSend,
	Puppeteer,
	readLines,
} from './common/Dependency.ts';

let ws = ConfigEnv.CHROME_DEBUG_WS;
if (
	ConfigEnv.CHROME_PATH_PROGRAM !== '' &&
	ConfigEnv.CHROME_PATH_PROFILE !== ''
) {
	const p = await Deno.run({
		cmd: [
			ConfigEnv.CHROME_PATH_PROGRAM,
			//'--headless',
			'--remote-debugging-port=8964',
			`--user-data-dir=${ConfigEnv.CHROME_PATH_PROFILE}`,
		],
		stdout: 'piped',
		stderr: 'piped',
	});

	// get the ws url from Chrome Output
	async function logChromeOuput() {
		for await (const line of readLines(p.stderr)) {
			console.info('chrome output:', line);
			const i = line.indexOf('ws://');
			if (i > 0) {
				return line.slice(i);
			}
		}
	}
	ws = (await logChromeOuput()) || '';
}

if (ws === '') {
	throw Error('Chrome debug WebSocket address is required.');
}

const doWork = async () => {
	const browser = await Puppeteer.connect({
		browserWSEndpoint: ws,
		ignoreHTTPSErrors: true,
	});

	const textHTML = await Deno.readTextFile(`${PUBLIC_PATH}/index.html`);
	const page = await browser.newPage();
	await page.setContent(textHTML);

	// Do stuff
	// await page.emulateMedia('screen'); // use screen media
	// await page.pdf({
	// 	path: `${PUBLIC_PATH}/index.pdf`,
	// 	displayHeaderFooter: true,
	// 	printBackground: true,
	// 	format: 'A4',
	// 	margin: {
	// 		left: '0px',
	// 		top: '0px',
	// 		right: '0px',
	// 		bottom: '0px',
	// 	},
	// });

	await new Promise((r) => setTimeout(() => r(), 5000));

	// Only close the page we just open
	await page.close();
};
await doWork();

/*
const PORT = 8080;
const getFullPath = (pPath: string) => `${PUBLIC_PATH}/${pPath}`;
const router = new OakRouter();
router.get('/', async (context) => {
	await OakSend(context, context.request.url.pathname, {
		root: PUBLIC_PATH,
		index: 'index.html',
	});
});
const app = new OakApplication();
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Listening on port ${PORT}...`);
await app.listen({ port: PORT });
*/
