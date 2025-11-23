import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = `ERROR: ${err.message} encountered.`;
  res.status(500).send(message);
};

export { errorHandler };