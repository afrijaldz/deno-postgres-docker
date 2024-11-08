import { IUser } from "../types/user.ts";
import { Client as PostgresClient } from "postgres/mod.ts";
import * as bcrypt from "bcrypt";
import { client as dbClient } from "../db.ts";

class UserModel {
  private dbClient: PostgresClient;

  constructor(dbClient: PostgresClient) {
    this.dbClient = dbClient;
  }

  private async hashThePassowrd(password: string): Promise<string> {
    return await bcrypt.hash(password);
  }

  private async beforeInsert(data: IUser): Promise<IUser> {
    const hashedPassword = await this.hashThePassowrd(data.password);
    return {
      ...data,
      password: hashedPassword,
    };
  }

  async insert(args: IUser): Promise<{ id: string }> {
    try {
      await this.dbClient.connect();
      const data = await this.beforeInsert(args);
      const text =
        "insert into users (id, email, password, name) values ($1, $2, $3, $4) returning id";
      const result = await this.dbClient.queryArray({
        text,
        args: [data.id, data.email, data.password, data.name],
      });
      await this.dbClient.end();
      return { id: result.rows[0][0] as string };
    } catch (error) {
      throw error;
    }
  }

  private async get(type: string, value: string | number): Promise<IUser[]> {
    try {
      await this.dbClient.connect();
      const text = `select * from users where ${type} = $1`;
      const result = await this.dbClient.queryArray({
        text,
        args: [value],
      });
      await this.dbClient.end();

      console.log(result);
      return result as unknown as IUser[];
      // return result.rowsOfObjects() as IUser[];
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<Omit<IUser, "password"> | null> {
    try {
      const [result] = await this.get("email", email);
      if (!result) return null;

      return {
        id: result.id,
        email: result.email,
        name: result.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<Omit<IUser, "password"> | null> {
    try {
      const [result] = await this.get("id", id);
      if (!result) return null;

      return {
        id: result.id,
        email: result.email,
        name: result.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(
    email: string,
    password: string
  ): Promise<Omit<IUser, "password"> | null> {
    try {
      const [user] = await this.get("email", email);
      if (!user) return null;

      const result = bcrypt.compare(password, user.password);
      if (!result) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      throw error;
    }
  }
}

export const User = new UserModel(dbClient);
