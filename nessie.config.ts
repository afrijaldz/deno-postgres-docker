import {
  ClientMySQL,
  ClientPostgreSQL,
  ClientSQLite,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

import { load } from "https://deno.land/x/denv@3.0.0/mod.ts";

await load({ path: ".env" });

/** Select one of the supported clients */
const client = new ClientPostgreSQL({
  database: Deno.env.get("DB_DATABASE"),
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
});

// const client = new ClientMySQL({
//     hostname: "localhost",
//     port: 3306,
//     username: "root",
//     // password: "pwd", // uncomment this line for <8
//     db: "nessie",
// });

// const client = new ClientSQLite("./sqlite.db");

/** This is the final config object */
const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
