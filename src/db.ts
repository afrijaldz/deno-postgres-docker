import { Client } from "postgres/mod.ts";

import { load } from "https://deno.land/x/denv@3.0.0/mod.ts";

await load({ path: ".env" });

const client = new Client({
  database: Deno.env.get("DB_DATABASE"),
  user: Deno.env.get("DB_USER"),
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  password: Deno.env.get("DB_PASSWORD"),
});

console.log(`Connected to database [${Deno.env.get("DB_DATABASE")}]`);

export default client;
