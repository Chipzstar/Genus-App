import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@genus/api";

import type { Category } from "~/lib/sanity.queries";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type UserState = {
	name: string;
	email: string;
};

type GetGroupBySlugOutput = inferRouterOutputs<AppRouter>["group"]["getGroupBySlug"];

export type GroupMembers = Pick<GetGroupBySlugOutput, "group">["group"]["members"];

export type GroupMember = GroupMembers[0];

export type GetThreadByIdOutput = inferRouterOutputs<AppRouter>["thread"]["getThreadById"];

export type ThreadComment = Pick<GetThreadByIdOutput, "comments">["comments"][0];

export type Messages = Pick<GetGroupBySlugOutput, "messages">["messages"];

export type Message = Messages[0];

type GetCompaniesOutput = inferRouterOutputs<AppRouter>["company"]["getCompanies"];

export type Company = GetCompaniesOutput[0];

export type CompanyReviews = GetCompaniesOutput[0]["reviews"];

export type UserProfile = inferRouterOutputs<AppRouter>["user"]["getByClerkId"];

export type AddTempPasswordInput = inferRouterInputs<AppRouter>["auth"]["addTempPassword"];

export type UserOnboardingStatusInput = inferRouterInputs<AppRouter>["auth"]["checkOnboardingStatus"];

export type UserOnboardingStatusOutput = inferRouterOutputs<AppRouter>["auth"]["checkOnboardingStatus"];

export interface MessagesProps {
	type: "message";
	message: Message;
}

export interface ThreadCommentsProps {
	type: "comment";
	message: ThreadComment;
}

export interface InsightPanel {
	slug: string;
	title: string;
	image: string;
}

export type GroupPanel = InsightPanel;

export interface CompanyPanel extends InsightPanel {
	category: Category;
}

export type RatingLevel = "Low" | "Medium" | "High" | "Super";
