import { OakSend, OakContext, OakApplication } from '../common/Dependency.ts';
import { PublicPath } from '../common/Config.ts';

async function ClientRespond(context: OakContext) {
	await OakSend(context, context.request.url.pathname, {
		root: PublicPath,
		index: 'index.html',
	});
}

export function ClientInit(application: OakApplication) {
	application.use(async (context) => {
		await ClientRespond(context);
	});
}
