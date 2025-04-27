import jwt from "jsonwebtoken";
import { Iuser } from "./dtoType";

class AuthorizeJWT {
  constructor() {}
  static async generateJWT(data: Iuser) {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
    const bearerToken = jwt.sign(
      { ...data },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );
    return bearerToken;
  }

  static async varifyAuthorizetion(token: string) {
    try {
      // const token = req.headers?.authorization?.split(" ")[1] as string
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );
      if (!decoded) {
        return {
          statusCode: 401,
          success: false,
          message: "Unauthorized access.",
          errorDetails: "You must be an admin to perform this action.",
        };
      }
      return {
        statusCode: 200,
        success: true,
        data: { ...decoded }
      }
    } catch (err) {
      return {
        statusCode: 403,
        success: false,
        message: "Unauthorized access.",
        errorDetails: "You must be an admin to perform this action.",
      };
    }
  }
}
export default AuthorizeJWT;
