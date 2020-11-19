import { serve, ServerRequest } from './common/Dependency.ts';

const PORT = 8080;
const SERVER = serve({ port: PORT });
const PUBLIC_PATH = `${Deno.cwd()}/src/client/public`;
console.log(`http://localhost:${PORT}/`);
const getFullPath = (pPath: string) => `${PUBLIC_PATH}/${pPath}`;
const HandleClient = async (pRequest: ServerRequest): Promise<void> => {
	if (pRequest.method === 'GET') {
		switch (pRequest.url) {
			case '/':
			case '/index.html':
				return pRequest.respond({
					headers: new Headers({ 'content-type': 'text/html' }),
					body: await Deno.open(getFullPath('index.html'), {
						read: true,
					}),
				});
				break;
			case '/favicon.ico':
				return pRequest.respond({
					headers: new Headers({ 'content-type': 'image/x-icon' }),
					body: await Deno.open(getFullPath('favicon.ico'), {
						read: true,
					}),
				});
				break;
			case '/index.css':
				return pRequest.respond({
					headers: new Headers({ 'content-type': 'text/css' }),
					body: await Deno.open(getFullPath('index.css'), {
						read: true,
					}),
				});
				break;
			case '/index.js':
				return pRequest.respond({
					headers: new Headers({
						'content-type': 'text/javascript',
					}),
					body: await Deno.open(getFullPath('index.js'), {
						read: true,
					}),
				});
				break;
			default:
				break;
		}
	}
	return pRequest.respond({ body: 'Not Found', status: 404 });
};

for await (const req of SERVER) {
	HandleClient(req);
}
