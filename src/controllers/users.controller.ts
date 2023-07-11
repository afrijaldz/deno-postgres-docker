import { Router, RouterContext } from "oak";
import client from "../db.ts";
import { IUser } from "../types/user.ts";
import { resolve } from "std/path/win32.ts";
import { UserForm, UserRepository } from "../repositories/users.repo.ts";

export function hello(ctx: RouterContext<string>) {
  const { response } = ctx;
  response.status = 200;
  response.body = {
    message: "Hello world",
  };
}

export async function all(ctx: RouterContext<string>) {
  await client.connect();
  const result = await client.queryObject(`SELECT * FROM Users`);

  const products = new Array();

  result.rows.map((p: any) => {
    let obj: any = new Object();

    result?.rowDescription?.columns.map((col, i) => {
      obj[col.name] = Object.values(p)[i];
    });

    products.push(obj);
  });

  const { response } = ctx;
  response.status = 200;
  response.type = "application/json";
  response.body = {
    message: "Hello world",
    // data: products,
  };
}

export async function createUser(ctx: RouterContext<string>) {
  const body: UserForm = await ctx.request.body().value;

  await UserRepository.validate(body);

  ctx.response.body = await UserRepository.create(body);
}
