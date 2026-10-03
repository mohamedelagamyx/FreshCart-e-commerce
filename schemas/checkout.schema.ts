import { z } from "zod";
import { EGYPTIAN_GOVERNORATES } from "@/constants/governorates";
export const checkoutSchema = z.object({
  details: z
    .string()
    .min(1, "Street and delivery details are required")
    .min(5, "Street details must be at least 5 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^01[0125][0-9]{8}$/,
      "Please enter a valid 11-digit Egyptian phone number (e.g. 01012345678)",
    ),
  city: z.enum(EGYPTIAN_GOVERNORATES, {
    errorMap: () => ({ message: "Please select a valid governorate" }),
  }),
  paymentMethod: z.enum(["cash", "online"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
});
export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
