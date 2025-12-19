import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be less than 12 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
