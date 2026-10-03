import { z } from "zod";
export const addressSchema = z.object({
  name: z
    .string()
    .min(1, "Address name is required")
    .min(3, "Address name must be at least 3 characters (e.g. Home, Office)")
    .max(30, "Address name cannot exceed 30 characters"),
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
  city: z.string().min(1, "Please select or enter your governorate"),
});
export type AddressSchemaValues = z.infer<typeof addressSchema>;
