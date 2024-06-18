import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from "drizzle-orm/pg-core";

export const careerinterest_slug = pgEnum("careerinterest_slug", ["law", "tech", "consulting", "banking_finance"]);
export const company_industry = pgEnum("company_industry", ["other", "law", "tech", "consulting", "banking_finance"]);
export const groupuser_role = pgEnum("groupuser_role", ["ADMIN", "EXPERT", "MEMBER"]);
export const message_type = pgEnum("message_type", ["NORMAL", "EVENT", "ANNOUNCEMENT"]);
export const skillset_slug = pgEnum("skillset_slug", [
	"written_communication",
	"verbal_communication",
	"interpersonal_skills",
	"time_management",
	"emotional_intelligence",
	"critical_thinking",
	"sales",
	"leadership_&_management",
	"negotiation",
	"creativity",
	"teamwork",
	"financial_literacy",
	"analytical_skills",
	"problem_solving",
	"project_management",
	"adaptability",
	"delegation",
	"data_analysis",
	"technical_&_coding_skills",
	"research",
	"public_speaking_&_presentation",
	"social_media_&_content_creation",
	"digital_skills",
	"marketing",
	"strategy",
	"organisation",
	"attention_to_detail",
	"conflict_resolution",
	"artistic_skills",
	"modelling",
	"commercial_awareness",
	"enterprise_and_entrepreneurial_skills",
	"customer_service",
	"design",
	"videography_&_photography"
]);
export const user_currentyear = pgEnum("user_currentyear", [
	"1st_year",
	"2nd_year",
	"3rd_year",
	"4th_year",
	"Graduate",
	"Postgraduate",
	"PHD",
	"Other",
	"graduate",
	"postgraduate",
	"phd",
	"other"
]);
export const user_ethnicity = pgEnum("user_ethnicity", [
	"english__welsh__scottish__northern_irish_or_british",
	"irish",
	"gypsy_or_irish_traveller",
	"roma",
	"any_other_white_background",
	"caribbean",
	"african",
	"any_other_black__black_british__or_caribbean_background",
	"indian",
	"pakistani",
	"bangladeshi",
	"chinese",
	"any_other_asian_background",
	"white_and_black_caribbean",
	"white_and_black_african",
	"white_and_asian",
	"any_other_mixed_or_multiple_ethnic_background",
	"arab",
	"any_other_ethnic_group"
]);
export const user_gender = pgEnum("user_gender", ["male", "female", "non_binary", "other"]);
export const user_onboardingstatus = pgEnum("user_onboardingstatus", [
	"not_started",
	"background_info",
	"career_info",
	"completed"
]);
export const user_profiletype = pgEnum("user_profiletype", [
	"STUDENT",
	"ADMIN",
	"EXPERT",
	"GRADUATE",
	"student",
	"graduate",
	"admin",
	"expert"
]);

export const group = pgTable(
	"group",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		slug: varchar("slug", { length: 191 }).notNull(),
		name: varchar("name", { length: 191 }).notNull()
	},
	table => {
		return {
			idx_49250_group_groupId_key: uniqueIndex("idx_49250_group_groupId_key").on(table.groupId),
			idx_49250_group_slug_key: uniqueIndex("idx_49250_group_slug_key").on(table.slug)
		};
	}
);

export const user = pgTable(
	"user",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		clerkId: varchar("clerkId", { length: 191 }).notNull(),
		email: varchar("email", { length: 191 }).notNull(),
		firstname: varchar("firstname", { length: 191 }).notNull(),
		lastname: varchar("lastname", { length: 191 }).notNull(),
		gender: user_gender("gender").default("female"),
		completionYear: integer("completionYear"),
		broadDegreeCourse: varchar("broadDegreeCourse", { length: 191 }),
		university: varchar("university", { length: 191 }),
		degreeName: varchar("degreeName", { length: 191 }),
		imageKey: varchar("imageKey", { length: 191 }),
		imageUrl: varchar("imageUrl", { length: 191 }),
		clerkImageHash: varchar("clerkImageHash", { length: 191 }),
		profileType: user_profiletype("profileType").default("student").notNull(),
		ethnicity: user_ethnicity("ethnicity").default("african"),
		currentYear: user_currentyear("currentYear"),
		experienceType: varchar("experienceType", { length: 191 }),
		onboardingStatus: user_onboardingstatus("onboardingStatus").default("background_info").notNull(),
		isActive: boolean("isActive").default(true).notNull(),
		isDeleted: boolean("isDeleted").default(false).notNull(),
		tempPassword: varchar("tempPassword", { length: 191 }).default("").notNull(),
		username: varchar("username", { length: 191 }).default("").notNull(),
		workPreference: varchar("workPreference", { length: 191 })
	},
	table => {
		return {
			clerkIdUserIdx: uniqueIndex("clerkIdUserIdx").on(table.clerkId),
			mailUserIdx: uniqueIndex("userEmailUserIdx").on(table.email)
		};
	}
);

export const reaction = pgTable(
	"reaction",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		reactionId: varchar("reactionId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: integer("messageId"),
		commentId: integer("commentId"),
		emoji: varchar("emoji", { length: 191 }).notNull(),
		code: varchar("code", { length: 191 }).notNull()
	},
	table => {
		return {
			idx_49277_reaction_authorId_messageId_commentId_idx: index(
				"idx_49277_reaction_authorId_messageId_commentId_idx"
			).on(table.authorId, table.messageId, table.commentId),
			idx_49277_reaction_reactionId_key: uniqueIndex("idx_49277_reaction_reactionId_key").on(table.reactionId)
		};
	}
);

export const thread = pgTable(
	"thread",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: integer("messageId").notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull()
	},
	table => {
		return {
			idx_49286_thread_authorId_messageId_groupId_idx: index(
				"idx_49286_thread_authorId_messageId_groupId_idx"
			).on(table.authorId, table.messageId, table.groupId),
			idx_49286_thread_threadId_key: uniqueIndex("idx_49286_thread_threadId_key").on(table.threadId),
			idx_49286_thread_messageId_key: uniqueIndex("idx_49286_thread_messageId_key").on(table.messageId)
		};
	}
);

export const careerInterest = pgTable(
	"careerInterest",
	{
		id: serial("id").primaryKey().notNull(),
		slug: careerinterest_slug("slug").notNull()
	},
	table => {
		return {
			idx_49236_careerInterest_slug_key: uniqueIndex("idx_49236_careerInterest_slug_key").on(table.slug)
		};
	}
);

export const groupUser = pgTable(
	"groupUser",
	{
		id: serial("id").primaryKey().notNull(),
		userId: varchar("userId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		role: groupuser_role("role").default("MEMBER").notNull(),
		firstname: varchar("firstname", { length: 191 }),
		imageUrl: varchar("imageUrl", { length: 191 }),
		lastname: varchar("lastname", { length: 191 })
	},
	table => {
		return {
			userId_groupId_idx: index("groupUser_userId_groupId_idx").on(table.userId, table.groupId)
		};
	}
);

export const comment = pgTable(
	"comment",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		commentId: varchar("commentId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		isAnonymous: boolean("isAnonymous").default(false).notNull()
	},
	table => {
		return {
			idx_49241_comment_authorId_threadId_groupId_idx: index(
				"idx_49241_comment_authorId_threadId_groupId_idx"
			).on(table.authorId, table.threadId, table.groupId),
			idx_49241_comment_commentId_key: uniqueIndex("idx_49241_comment_commentId_key").on(table.commentId)
		};
	}
);

export const message = pgTable(
	"message",
	{
		id: serial("id").primaryKey().notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		messageId: varchar("messageId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		type: message_type("type").default("NORMAL").notNull(),
		isAnonymous: boolean("isAnonymous").default(false).notNull()
	},
	table => {
		return {
			idx_49267_message_messageId_key: uniqueIndex("idx_49267_message_messageId_key").on(table.messageId),
			idx_49267_message_authorId_groupId_idx: index("idx_49267_message_authorId_groupId_idx").on(
				table.authorId,
				table.groupId
			)
		};
	}
);

export const company = pgTable(
	"company",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		companyId: varchar("companyId", { length: 191 }).notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		slug: varchar("slug", { length: 191 }).notNull(),
		description: varchar("description", { length: 191 }),
		logoUrl: varchar("logoUrl", { length: 191 }),
		websiteUrl: varchar("websiteUrl", { length: 191 }),
		isDeleted: boolean("isDeleted").default(false).notNull(),
		category: company_industry("category").notNull()
	},
	table => {
		return {
			dIdx: uniqueIndex("companyIdIdx").on(table.companyId),
			lugIdx: uniqueIndex("companySlugIdx").on(table.slug)
		};
	}
);

export const typeformWebhook = pgTable(
	"typeformWebhook",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		eventId: varchar("eventId", { length: 191 }).notNull(),
		eventType: varchar("eventType", { length: 191 }).notNull(),
		typeformId: varchar("typeformId", { length: 191 }).notNull(),
		title: varchar("title", { length: 191 }).notNull(),
		num_questions: integer("num_questions").notNull(),
		num_answers: integer("num_answers").notNull(),
		url: varchar("url", { length: 191 }),
		isDeleted: boolean("isDeleted").default(false).notNull()
	},
	table => {
		return {
			typeFormWebhookEventIdIdx: uniqueIndex("typeFormWebhookEventIdIdx").on(table.eventId)
		};
	}
);

export const referral = pgTable(
	"referral",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		submissionId: varchar("submissionId", { length: 191 }).notNull(),
		referralId: varchar("referralId", { length: 191 }).notNull(),
		referrerName: varchar("referrerName", { length: 191 }).notNull(),
		referrerEmail: varchar("referrerEmail", { length: 191 }).notNull(),
		refereeEmail1: varchar("refereeEmail1", { length: 191 }).notNull(),
		refereeEmail2: varchar("refereeEmail2", { length: 191 }),
		refereeEmail3: varchar("refereeEmail3", { length: 191 }),
		isActive: boolean("isActive").default(true).notNull(),
		isDeleted: boolean("isDeleted").default(false).notNull()
	},
	table => {
		return {
			dIdx: uniqueIndex("referralIdIdx").on(table.referralId)
		};
	}
);

export const skillset = pgTable(
	"skillset",
	{
		id: serial("id").primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		slug: skillset_slug("slug").notNull()
	},
	table => {
		return {
			idx_49237_skillset_slug_key: uniqueIndex("idx_49237_skillset_slug_key").on(table.slug)
		};
	}
);

export const review = pgTable(
	"review",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		reviewId: varchar("reviewId", { length: 191 }).notNull(),
		companyId: varchar("companyId", { length: 191 }).notNull(),
		companyName: varchar("companyName", { length: 191 }).notNull(),
		experienceType: varchar("experienceType", { length: 191 }),
		applicationProcess: numeric("applicationProcess").notNull(),
		interviewProcess: numeric("interviewProcess").notNull(),
		diversity: numeric("diversity").notNull(),
		flexibility: numeric("flexibility").notNull(),
		teamCulture: numeric("teamCulture").notNull(),
		workLifeBalance: numeric("workLifeBalance").notNull(),
		authenticity: numeric("authenticity").notNull(),
		recommendToFriend: numeric("recommendToFriend").notNull(),
		avgRating: numeric("avgRating").notNull(),
		isConverter: boolean("isConverter").default(false).notNull(),
		completionYear: integer("completionYear"),
		division: varchar("division", { length: 191 }),
		region: varchar("region", { length: 191 }).notNull(),
		topTip: varchar("topTip", { length: 191 }).default("").notNull(),
		topSkills: text("topSkills").default("{}").array().notNull(),
		pros: text("pros").default("{}").array().notNull(),
		cons: text("cons").default("{}").array().notNull(),
		interviewQuestions: text("interviewQuestions").default("{}").array().notNull(),
		topResources: text("topResources").default("{}").array().notNull(),
		isDeleted: boolean("isDeleted").default(false).notNull(),
		industry: company_industry("industry").notNull()
	},
	table => {
		return {
			dIdx: uniqueIndex("reviewIdIdx").on(table.reviewId)
		};
	}
);

export const careerInterestToUser = pgTable(
	"careerInterestToUser",
	{
		careerInterestId: integer("careerInterestId").notNull(),
		userId: integer("userId").notNull()
	},
	table => {
		return {
			careerInterestUserId: primaryKey({
				columns: [table.careerInterestId, table.userId],
				name: "careerInterestUserId"
			})
		};
	}
);

export const companyToUser = pgTable(
	"companyToUser",
	{
		companyId: integer("companyId").notNull(),
		userId: integer("userId").notNull()
	},
	table => {
		return {
			companyUserId: primaryKey({ columns: [table.companyId, table.userId], name: "companyUserId" })
		};
	}
);

export const skillsetToUser = pgTable(
	"skillsetToUser",
	{
		skillsetId: integer("skillsetId").notNull(),
		userId: integer("userId").notNull()
	},
	table => {
		return {
			skillsetUserId: primaryKey({ columns: [table.skillsetId, table.userId], name: "skillsetUserId" })
		};
	}
);
