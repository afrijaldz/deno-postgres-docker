import { Context } from "oak";

export function hello(ctx: Context) {
  const { response } = ctx;
  response.status = 200;
  response.body = {
    message: "Hello world",
  };
}
