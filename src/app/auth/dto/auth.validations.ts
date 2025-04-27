import { z } from "zod";

export const userValidationSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format."),
    password: z.string()
})



export const validationUser = (data: any) => {
    const result = userValidationSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return {
        success: false,
        statusCode: 400,
        message: "Validation error occurred.",
        errorDetails: {
          field: firstError.path.join("."),
          message: firstError.message,
        },
      };
    }
    return result
}