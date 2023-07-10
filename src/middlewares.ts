import { Context } from "oak";

export async function handleErrors(
  context: Context,
  next: () => Promise<void>
) {
  try {
    await next();
  } catch (error) {
    context.response.status = error.status;
    const { message = "unknown errors", status = 500, stack = null } = error;
    context.response.body = { message, status, stack };
    context.response.type = "json";
  }
}
