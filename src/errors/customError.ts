interface CustomErrorParams {
  name?: string;
  cause?: any;
  message: string;
  code?: number;
}

interface Error {
  name: string;
  cause?: any;
  code?: number;
}

export class CustomError {
  static create({
    name = "Error",
    cause,
    message,
    code = 1,
  }: CustomErrorParams) {
    const error = new Error(message) as Error;
    error.name = name;
    error.cause = cause;
    error.code = code;
    throw error;
  }
}
