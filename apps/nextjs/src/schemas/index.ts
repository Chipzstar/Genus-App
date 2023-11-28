import * as z from "zod";

export const genders = ["male", "female", "non-binary", "other"] as const;
export const career_interests = ["banking_finance", "consulting", "law", "tech"] as const;

const gendersSchema = z.enum(genders)

const careerInterestsSchema = z.enum(career_interests)

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Please enter your email address.",
        })
        .email(),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export const signupSchema = z.object({
    firstname: z
        .string({required_error: "Please enter your first name."})
        .min(2, {
            message: "First name must be at least 2 characters.",
        })
        .max(30, {
            message: "First name must not be longer than 30 characters.",
        }),
    lastname: z
        .string({required_error: "Please enter your last name."})
        .min(2, {
            message: "Last name must be at least 2 characters.",
        })
        .max(30, {
            message: "Last name must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please enter your email address.",
        })
        .email(),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string(),
    gender: gendersSchema,
    university: z.enum(["london-school-of-economics", "kings-college-london"]).default("london-school-of-economics"),
    broad_degree_course: z.union([z.literal("BSc"), z.literal("MSc"), z.literal("")]),
    degree_name: z.string({required_error: "Please enter your degree."}).min(2),
    completion_year: z.string({required_error: "Please enter your completion year."}),
    career_interests: careerInterestsSchema,
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Passwords must match!",
        path: ["confirmPassword"],
    })
