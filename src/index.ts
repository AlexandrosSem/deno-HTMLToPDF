import {
	OakApplication,
	OakRouter,
	OakSend,
	Puppeteer,
	Config,
	readLines,
} from './common/Dependency.ts';

const CHROME_PATH_PROGRAM = Config.CHROME_PATH_PROGRAM
	? Config.CHROME_PATH_PROGRAM
	: '';
const CHROME_PATH_PROFILE = Config.CHROME_PATH_PROFILE
	? Config.CHROME_PATH_PROFILE
	: '';

const p = await Deno.run({
	cmd: [
		CHROME_PATH_PROGRAM,
		//'--headless',
		'--remote-debugging-port=8964',
		`--user-data-dir=${CHROME_PATH_PROFILE}`,
		'https://www.google.com',
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

const ws = await logChromeOuput();
console.log(ws);

if (ws) {
	const browser = await Puppeteer.connect({
		browserWSEndpoint: ws,
		ignoreHTTPSErrors: true,
	});

	const page = (await browser.pages())[0];
	await page.goto('https://github.com/');
	// do whatever you want
}

const PORT = 8080;
const PUBLIC_PATH = `${Deno.cwd()}/src/client/public`;
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
