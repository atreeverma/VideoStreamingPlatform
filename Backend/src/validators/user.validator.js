import { z } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        fullname: z.string().trim().min(2, "Full name is required"),
        email: z.string().trim().email("Invalid email"),
        username: z.string().trim().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().trim().email("Invalid email").optional(),
        username: z.string().trim().min(3).optional(),
        password: z.string().min(1, "Password is required"),
    }).refine((data) => data.email || data.username, {
        message: "Email or username is required",
        path: ["email"],
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
    }),
});

export const updateAccountSchema = z.object({
    body: z.object({
        fullname: z.string().trim().min(2, "Full name is required"),
        email: z.string().trim().email("Invalid email"),
    }),
});