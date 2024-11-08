import { httpStatusCodes } from "../httpStatusCodes/index.js";

class ConflictError extends Error {
  constructor(message) {
    super();
    this.statusCode = httpStatusCodes.CONFLICT;
    this.messageObject = message;
    Error.captureStackTrace(this);
  }
}

export { ConflictError };
