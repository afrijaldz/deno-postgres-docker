import { Client } from "postgres/mod.ts";

const client = new Client({
  user: "ijul",
  database: "deno_init",
  hostname: "localhost",
  port: 5432,
});

await client.connect();
