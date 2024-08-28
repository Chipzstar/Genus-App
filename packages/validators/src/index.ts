import * as z from "zod";

import {
	broad_course_categories,
	career_interests,
	companies,
	completion_years,
	ethnicities,
	experience_types,
	genders,
	hobbies,
	industries,
	profile_types,
	role_sectors,
	skillsets,
	universities,
	university_years,
	working_environment_types
} from "./constants";

export const gendersSchema = z.enum(genders);

export const ethnicitiesSchema = z.enum(ethnicities);

export const roleSectorsSchema = z.enum(role_sectors);

export const industrySchema = z.enum(industries);

export const careerInterestsSchema = z.enum(career_interests);

export const hobbiesInterestsSchema = z.enum(hobbies);

export type Industry = z.infer<typeof industrySchema>;

export const broadCourseCategorySchema = z.enum(broad_course_categories);

export const universitiesSchema = z.enum(universities);

export const companiesSchema = z.enum(companies);

export const skillsetsSchema = z.enum(skillsets);

export const completionYearSchema = z.enum(completion_years);

export const currentYearSchema = z.enum(university_years);

export const profileTypeSchema = z.enum(profile_types);

export const experienceTypeSchema = z.enum(experience_types);

export const workEnvironmentSchema = z.enum(working_environment_types);

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
	age: z.union([
		z
			.number()
			.min(18, { message: "You must be at least 18 years old." })
			.max(60, { message: "You must be at most 60 years old." }),
		z
			.string()
			.transform(val => parseInt(val, 10))
			.refine(val => !isNaN(val) && val >= 18 && val <= 60, {
				message: "You must be between 18 and 60 years old."
			})
	]),
	role_sector: roleSectorsSchema,
	hobbies_interests: z.array(hobbiesInterestsSchema).nonempty({ message: "Please select at least one hobby" })
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
	age: true,
	role_sector: true
});

export const signupStep3Schema = signupBaseSchema.pick({
	hobbies_interests: true
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

export const referralEmailSchema = z.object({
	submissionId: z.string(),
	recipients: z.array(z.string().email()),
	subject: z.string(),
	referrerName: z.string(),
	referrerEmail: z.string().email()
});

export const CreateBusinessSchema = z.object({
	title: z.string().min(1, "Business name is required"),
	description: z.string().min(1, "Description is required"),
	tags: z.array(z.string()).nonempty("At least one tag is required"),
	admins: z.array(z.string()).nonempty("At least one admin is required"),
	logoUrl: z.string().url(),
	tiktok: z.string().optional(),
	instagram: z.string().optional(),
	linkedIn: z.string().optional(),
	other: z.string().optional()
});

export type CreateBusiness = z.infer<typeof CreateBusinessSchema>;
