import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(20, "Username cannot exceed 20 characters.")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, dashes, and underscores."
  );

export const displayNameSchema = z
  .string()
  .min(3, "Display name must be at least 3 characters.")
  .max(20, "Display name cannot exceed 20 characters.");

export const emailSchema = z.string().email("Invalid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character."
  );

// Sign In
export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Sign Up
export const signUpFormSchema = z.object({
  username: usernameSchema,
  displayName: displayNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Types for form data
export type SignInFormData = z.infer<typeof signInFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
