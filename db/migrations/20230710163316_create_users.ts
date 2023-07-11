import {
  AbstractMigration,
  ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

import Dex from "https://deno.land/x/dex@1.0.2/mod.ts";
export default class extends AbstractMigration<ClientPostgreSQL> {
  async up(): Promise<void> {
    const query = Dex({ client: "postgres" })
      .schema.createTable("users", (table: any) => {
        table.bigIncrements("id").primary();
        table.string("name", 50);
        table.string("email", 50).unique();
        table.string("password", 50);
        table.timestamps(undefined, true);
      })
      .toString();

    await this.client.queryArray(query);
  }

  async down(): Promise<void> {
    const query = Dex({ client: "postgres" }).schema.dropTable("users");

    await this.client.queryArray(query);
  }
}
