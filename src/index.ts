import { OakApplication, OakRouter, OakSend } from './common/Dependency.ts';

const PORT = 8080;
const PUBLIC_PATH = `${Deno.cwd()}/src/client/public`;
const getFullPath = (pPath: string) => `${PUBLIC_PATH}/${pPath}`;
const router = new OakRouter();
const app = new OakApplication();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
	await OakSend(context, context.request.url.pathname, {
		root: PUBLIC_PATH,
		index: 'index.html',
	});
});
await app.listen({ port: PORT });
