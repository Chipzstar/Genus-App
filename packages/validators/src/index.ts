import * as z from "zod";

import {
	broad_course_categories,
	career_interests,
	completion_years,
	ethnicities,
	genders,
	profile_types,
	universities,
	university_years
} from "./constants";

export const gendersSchema = z.enum(genders);

export const ethnicitiesSchema = z.enum(ethnicities);

export const careerInterestsSchema = z.enum(career_interests);

export const broadCourseCategorySchema = z.enum(broad_course_categories);

export const universitiesSchema = z.enum(universities);

export const completionYearSchema = z.enum(completion_years);

export const currentYearSchema = z.enum(university_years);

export const profileTypeSchema = z.enum(profile_types);

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
	username: z
		.string({
			required_error: "Please enter your username."
		})
		.min(2, { message: "Username must be at least 2 characters." }),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters."
	}),
	confirmPassword: z.string(),
	gender: gendersSchema,
	ethnicity: ethnicitiesSchema,
	university: universitiesSchema,
	broad_degree_course: broadCourseCategorySchema,
	degree_name: z
		.string({ required_error: "Please enter your degree." })
		.min(2, "Degree name must be at least 2 characters"),
	current_year: currentYearSchema,
	completion_year: completionYearSchema,
	career_interests: z
		.array(careerInterestsSchema)
		.nonempty({ message: "Please select at least one career interest" }),
	company_interests: z
		.array(careerInterestsSchema)
		.nonempty({ message: "Please select at least one career interest" }),
	experience_type: profileTypeSchema
});

export const signupStep1Schema = signupBaseSchema
	.pick({
		firstname: true,
		lastname: true,
		email: true,
		username: true,
		password: true,
		confirmPassword: true
	})
	.refine(
		values => {
			return values.password === values.confirmPassword;
		},
		{
			message: "Passwords must match!",
			path: ["confirmPassword"]
		}
	);

export const signupStep2Schema = signupBaseSchema.pick({
	gender: true,
	ethnicity: true,
	university: true,
	broad_degree_course: true,
	degree_name: true,
	current_year: true,
	completion_year: true
});

export const signupStep3Schema = signupBaseSchema.pick({
	career_interests: true,
	company_interests: true,
	experience_type: true
});

export const forgotPasswordSchema = z.object({
	email: z
		.string({
			required_error: "Please enter your email address."
		})
		.email({ message: "Invalid email address." })
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(2, {
			message: "Password must be at least 2 characters."
		}),
		confirmPassword: z.string()
	})
	.refine(
		values => {
			return values.password === values.confirmPassword;
		},
		{
			message: "Passwords must match!",
			path: ["confirmPassword"]
		}
	);

export const profileSchema = signupBaseSchema.omit({
	email: true,
	password: true,
	confirmPassword: true,
	gender: true,
	ethnicity: true
});
