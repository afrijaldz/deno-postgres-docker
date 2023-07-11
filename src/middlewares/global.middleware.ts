import type { Context, Next } from "oak";
import ApiError from "../controllers/error.ts";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    let status = 500;
    let body: Record<string, unknown> = { error: error.message };
    const isApiError = error instanceof ApiError;

    if (isApiError) {
      status = error.status;
      body = ApiError.toResponse(error);
    }

    ctx.response.status = status;
    ctx.response.body = body;

    // if (IS_DEV && !isApiError) console.error(err);
  }
}

export async function enableCors(ctx: Context, next: Next) {
  const origin = ctx.request.headers.get("origin") || "";

  ctx.response.headers.set("Access-Control-Allow-Origin", origin);
  ctx.response.headers.set("Access-Control-Allow-Credentials", "true");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }

  await next();
}
