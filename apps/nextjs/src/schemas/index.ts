import * as z from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string(),
    gender: z.union([z.literal("male"), z.literal("female")]).default("male"),
    university: z.string({required_error: "Please select your university."}),
    degree_course: z.string({required_error: "Please enter your degree."}).min(2),
    completion_year: z.string({required_error: "Please enter your completion year."}),
    career_interests: z.string({required_error: "Please select your career interests."}).min(3, {
        message: "Username must be at least 2 characters.",
    })
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Passwords must match!",
        path: ["confirmPassword"],
    })
