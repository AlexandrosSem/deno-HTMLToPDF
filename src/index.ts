import {
	OakApplication,
	OakRouter,
	OakSend,
	Puppeteer,
	Config,
	readLines,
} from './common/Dependency.ts';
const PUBLIC_PATH = `${Deno.cwd()}/src/client/public`;
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
if (ws) {
	const browser = await Puppeteer.connect({
		browserWSEndpoint: ws,
		ignoreHTTPSErrors: true,
	});
	const textHTML = await Deno.readTextFile(`${PUBLIC_PATH}/index.html`);
	const page = await browser.newPage();
	await page.setContent(textHTML);
	/*
	await page.emulateMedia('screen'); // use screen media
	await page.pdf({
		// generate pdf
		path: `${PUBLIC_PATH}/index.pdf`,
		displayHeaderFooter: true,
		printBackground: true,
		format: 'A4',
		margin: {
			left: '0px',
			top: '0px',
			right: '0px',
			bottom: '0px',
		},
	});
	*/
	//await browser.close();
}

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
