import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@genus/api";

export interface LoginUser {
	email: string;
	password: string;
}

export interface ClerkEvent {
	data: UserData;
	object: "event";
	type: ClerkEventType;
}

type ClerkEventType = "user.created" | "user.updated" | "email.created" | "user.deleted";

export interface UserData {
	backup_code_enabled: boolean;
	banned: boolean;
	birthday: string;
	created_at: number;
	email_addresses: EmailAddress[];
	external_accounts: never[];
	external_id: never;
	first_name: string;
	gender: string;
	id: string;
	image_url: string;
	last_name: string;
	last_sign_in_at: never;
	object: string;
	password_enabled: boolean;
	phone_numbers: never[];
	primary_email_address_id: string;
	primary_phone_number_id: never;
	primary_web3_wallet_id: never;
	private_metadata: NonNullable<unknown>;
	profile_image_url: string;
	public_metadata: NonNullable<unknown>;
	totp_enabled: boolean;
	two_factor_enabled: boolean;
	unsafe_metadata: NonNullable<unknown>;
	updated_at: number;
	username: never;
	web3_wallets: never[];
}

export interface EmailAddress {
	email_address: string;
	id: string;
	linked_to: never[];
	object: string;
	reserved: boolean;
	verification: Verification;
}

export interface Verification {
	attempts: number;
	expire_at: number;
	status: string;
	strategy: string;
}

export interface GeneratePaperPayload {
	paper_id: string;
	paper_name: string;
	course: string;
	subject: string;
	exam_board: string;
	num_questions: number | string;
	num_marks: number | string;
}

type GetGroupBySlugOutput = inferRouterOutputs<AppRouter>["group"]["getGroupBySlug"];

export type GroupMembers = Pick<GetGroupBySlugOutput, "members">["members"];

export type GroupMember = Pick<GetGroupBySlugOutput, "members">["members"][0];

export type GetThreadByIdOutput = inferRouterOutputs<AppRouter>["thread"]["getThreadById"];

export type ThreadComment = Pick<GetThreadByIdOutput, "comments">["comments"][0];

export type Messages = Pick<GetGroupBySlugOutput, "messages">["messages"];

export type Message = Pick<GetGroupBySlugOutput, "messages">["messages"][0];

export type UserProfile = inferRouterOutputs<AppRouter>["user"]["getByClerkId"];

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

export interface GroupPanel {
	slug: string;
	title: string;
	image: string;
}
