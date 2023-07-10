import { Application, Router } from "oak";
import { hello } from "./controllers/user.ts";
// import { bgGreen, black } from "fmt/colors.ts";
// import * as yup from "https://cdn.pika.dev/yup@^0.29.0";

// import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const router = new Router();

router.get("/", hello);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
