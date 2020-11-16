import { serve } from './common/Dependency.ts';

const PORT = 8080;
const SERVER = serve({ port: PORT });
console.log(`http://localhost:${PORT}/`);

for await (const req of SERVER) {
}
