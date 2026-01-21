import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(2).max(255).trim(),
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
    role: z.enum(['user', 'admin']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const signInSchema = z.object({
    email: z.string().email().max(255).toLowerCase().trim(),
    password: z.string().min(1),
});
