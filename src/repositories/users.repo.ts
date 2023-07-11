import ApiError from "../controllers/error.ts";
import client from "../db.ts";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface DbUser extends User {
  created_at: Date;
  updated_at: Date;
}

export interface ApiUser extends User {
  createdAt: Date;
  updatedAt: Date;
}

export type UserForm = Pick<User, "name" | "email" | "password">;

export class UserRepository {
  private static toApiUser(apiUser: DbUser) {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      password: apiUser.password,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
    };
  }

  static validate(user: UserForm): never | void {
    if (!user.name) {
      throw ApiError.validation("Name is required", "name");
    } else if (!user.email) {
      throw ApiError.validation("Email is required", "email");
    } else if (!user.password) {
      throw ApiError.validation("Password is required", "password");
    }
  }

  static async all(search: string | null): Promise<ApiUser[]> {
    let query: [string, string[]] = ["SELECT * FROM users", []];

    if (search) {
      query = ["SELECT * FROM users WHERE name ILIKE $1", [`%${search}%`]];
    }

    const users = await client.queryObject<DbUser>(query[0], query[1]);
    return users.rows.map((book) => this.toApiUser(book));
  }

  static async create(user: UserForm): Promise<ApiUser> {
    const result = await client.queryObject<DbUser>(
      "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *",
      [user.name, user.password, user.email]
    );

    const data = JSON.stringify(result.rows[0], (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    );

    return this.toApiUser(JSON.parse(data));
  }
}
