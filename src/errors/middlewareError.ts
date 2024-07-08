import { Request, Response, NextFunction } from "express";
import enumError from "./enumError";

interface CustomError extends Error {
  cause?: any;
  code?: typeof enumError[keyof typeof enumError];
}

export const errorHandlerMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* console.error(error.cause || error.message); */
  switch (error.code) {
    case enumError.BAD_REQUEST_ERROR:
    case enumError.INVALID_PARAMS_ERROR:
    case enumError.EMPTY_QUERY:
      res.status(400).json({ status: "error", message: error.message });
      break;
    case enumError.DATA_BASE_ERROR:
    case enumError.ROUTING_ERROR:
    default:
      res.status(500).json({ status: "error", message: error.message });
  }
};
