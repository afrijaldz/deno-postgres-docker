export default class ApiError extends Error {
  name = "ApiError";

  constructor(public status: number, message: string, public field?: string) {
    super(message);
  }

  static validation(message: string, field?: string) {
    return new ApiError(400, message, field);
  }

  static toResponse(error: ApiError) {
    return { error: error.message, field: error.field };
  }
}
