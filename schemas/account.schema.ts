import { z } from "zod";
import { signupSchema } from "./auth.schema";
export const profileSchema = signupSchema
  .innerType()
  .pick({ name: true, email: true, phone: true });
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });
