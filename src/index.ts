import { OakApplication } from './common/Dependency.ts';
import { env } from './common/Config.ts';
import { ClientInit } from './client/Client.ts';
import { ServerInit } from './server/Server.ts';

const PORT = env.LISTEN_HTTP_PORT;

const app = new OakApplication();
app.addEventListener('listen', ({ hostname, port, secure }) => {
	console.log(
		`Listening on: ${secure ? 'https://' : 'http://'}${
			hostname ?? 'localhost'
		}:${port}`
	);
});

ServerInit(app);
ClientInit(app);

await app.listen({ port: PORT });
