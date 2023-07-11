import { Application } from "oak";
import router from "./router.ts";
import { enableCors, errorHandler } from "./middlewares/global.middleware.ts";

const app = new Application();

app.use(enableCors);
app.use(errorHandler);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running: http://localhost:${8000}`);
await app.listen({ port: 8000 });
