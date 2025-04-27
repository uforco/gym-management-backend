import { NextFunction, Request, Response } from "express";
import AuthorizeJWT from "../jwt/AuthorizeJWT";

const varifyAuthrize =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(" ")[1] as string;

    const varifyAuth = await AuthorizeJWT.varifyAuthorizetion(token);
    if (varifyAuth.statusCode !== 200 && !varifyAuth.success) {
      res.status(varifyAuth.statusCode).send(varifyAuth);
      return;
    }
    if (!roles.includes(varifyAuth.data.role)) {
      res.status(401).send({
        statusCode: 401,
        success: false,
        message: "Unauthorized access.",
        errorDetails: "You must be an admin to perform this action.",
      });
      return;
    }
    next();
  };

export default varifyAuthrize;
