import * as z from "zod";

import { broad_course_categories, career_interests, genders, universities } from "./constants";

export const completion_years = [
	"2020",
	"2021",
	"2022",
	"2023",
	"2024",
	"2025",
	"2026",
	"2027",
	"2028",
	"2029",
	"2030"
] as const;

export const gendersSchema = z.enum(genders);

export const careerInterestsSchema = z.enum(career_interests);

export const broadCourseCategorySchema = z.enum(broad_course_categories);

export const universitiesSchema = z.enum(universities);

export const completionYearSchema = z.enum(completion_years);

export const loginSchema = z.object({
	email: z
		.string({
			required_error: "Please enter your email address."
		})
		.email({ message: "Invalid email address." }),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters."
	})
});

export const signupBaseSchema = z.object({
	firstname: z
		.string({ required_error: "Please enter your first name." })
		.min(2, {
			message: "First name must be at least 2 characters."
		})
		.max(30, {
			message: "First name must not be longer than 30 characters."
		}),
	lastname: z
		.string({ required_error: "Please enter your last name." })
		.min(2, {
			message: "Last name must be at least 2 characters."
		})
		.max(30, {
			message: "Last name must not be longer than 30 characters."
		}),
	email: z
		.string({
			required_error: "Please enter your email address."
		})
		.email(),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters."
	}),
	confirmPassword: z.string(),
	gender: gendersSchema,
	university: universitiesSchema,
	broad_degree_course: broadCourseCategorySchema,
	degree_name: z
		.string({ required_error: "Please enter your degree." })
		.min(2, "Degree name must be at least 2 characters"),
	completion_year: completionYearSchema,
	career_interests: z.array(careerInterestsSchema).nonempty({ message: "Please select at least one career interest" })
});

export const signupSchema = signupBaseSchema.refine(
	values => {
		return values.password === values.confirmPassword;
	},
	{
		message: "Passwords must match!",
		path: ["confirmPassword"]
	}
);

export const profileSchema = signupBaseSchema.omit({ email: true, password: true, confirmPassword: true });
