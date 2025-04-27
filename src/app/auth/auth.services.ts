import argon2 from "argon2";
import prisma from "../../lib/prismaClient";
import { validationUser } from "./dto/auth.validations";
import AuthorizeJWT from "../../jwt/AuthorizeJWT";

class AuthServices {
  constructor() {}

  static async loginService(data: { email: string; password: string }) {
    try {
      const result = validationUser(data);
      if (!result.success || !("data" in result)) return result;

      const userData = await prisma.user.findFirst({
        where: { email: result?.data.email },
      });
      if (!userData) {
        return {
          success: false,
          statusCode: 400,
          message: "Validation error occurred.",
          errorDetails: {
            field: "email",
            message: "Invalid email format.",
          },
        };
      }
      //   password checking
      const verifyPassword = await argon2.verify(
        userData.password,
        result.data.password
      );
      if (!verifyPassword) {
        return {
          success: false,
          statusCode: 400,
          message: "Validation error occurred.",
          errorDetails: {
            field: "password",
            message: "Invalid Password format.",
          },
        };
      }

      const userInfo = {
        id: userData.id,
        email: userData.email,
        role: userData.role
      }
      const BearerrToken = await AuthorizeJWT.generateJWT(userInfo)
      return {
        success: false,
        statusCode: 200,
        data: {...userInfo, BearerrToken}
      };
    } catch (err) {
        throw new Error('internal server error')
    }
  }
}

export default AuthServices;
