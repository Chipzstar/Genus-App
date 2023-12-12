import * as z from "zod";
import {labelEncode} from "~/utils";

export const genders = ["male", "female", "non-binary", "other"] as const;
export const career_interests = ["banking_finance", "consulting", "law", "tech"] as const;
export const broad_course_categories = ["accounting-and-finance", "agriculture-and-environmental-sciences", "architecture-and-planning", "arts-and-design", "business-and-management", "computer-science-and-it", "economics", "education", "engineering", "health-and-medicine", "humanities-and-social-sciences", "law-and-legal-studies", "language-and-linguistics", "mathematics-and-statistics", "media-and-communications", "natural-sciences", "sports-and-exercise-science"] as const
export const completion_years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"] as const

const gendersSchema = z.enum(genders)

const careerInterestsSchema = z.enum(career_interests)

const broadCourseCategorySchema = z.enum(broad_course_categories)

const completionYearSchema = z.enum(completion_years)

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Please enter your email address.",
        })
        .email({message: "Invalid email address."}),
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
    university: z.string(),
    broad_degree_course: broadCourseCategorySchema,
    degree_name: z.string({required_error: "Please enter your degree."}).min(2),
    completion_year: completionYearSchema,
    career_interests: careerInterestsSchema,
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Passwords must match!",
        path: ["confirmPassword"],
    })
