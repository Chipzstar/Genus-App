-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `CareerInterest` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` enum('law','tech','consulting','banking_finance') NOT NULL,
	CONSTRAINT `CareerInterest_id` PRIMARY KEY(`id`),
	CONSTRAINT `CareerInterest_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Comment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`commentId` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`authorId` varchar(191) NOT NULL,
	`threadId` varchar(191) NOT NULL,
	`groupId` varchar(191) NOT NULL,
	CONSTRAINT `Comment_id` PRIMARY KEY(`id`),
	CONSTRAINT `Comment_commentId_key` UNIQUE(`commentId`)
);
--> statement-breakpoint
CREATE TABLE `Group` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`groupId` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `Group_id` PRIMARY KEY(`id`),
	CONSTRAINT `Group_groupId_key` UNIQUE(`groupId`),
	CONSTRAINT `Group_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `GroupUser` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`groupId` varchar(191) NOT NULL,
	`role` enum('ADMIN','EXPERT','MEMBER') NOT NULL DEFAULT 'MEMBER',
	`firstname` varchar(191),
	`imageUrl` varchar(191),
	`lastname` varchar(191),
	CONSTRAINT `GroupUser_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Message` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`messageId` varchar(191) NOT NULL,
	`authorId` varchar(191) NOT NULL,
	`groupId` varchar(191) NOT NULL,
	`type` enum('NORMAL','EVENT','ANNOUNCEMENT') NOT NULL DEFAULT 'NORMAL',
	CONSTRAINT `Message_id` PRIMARY KEY(`id`),
	CONSTRAINT `Message_messageId_key` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `Reaction` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`reactionId` varchar(191) NOT NULL,
	`authorId` varchar(191) NOT NULL,
	`messageId` int,
	`commentId` int,
	`emoji` varchar(191) NOT NULL,
	`code` varchar(191) NOT NULL,
	CONSTRAINT `Reaction_id` PRIMARY KEY(`id`),
	CONSTRAINT `Reaction_reactionId_key` UNIQUE(`reactionId`)
);
--> statement-breakpoint
CREATE TABLE `Thread` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`threadId` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`authorId` varchar(191) NOT NULL,
	`messageId` int NOT NULL,
	`groupId` varchar(191) NOT NULL,
	CONSTRAINT `Thread_id` PRIMARY KEY(`id`),
	CONSTRAINT `Thread_threadId_key` UNIQUE(`threadId`),
	CONSTRAINT `Thread_messageId_key` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`clerkId` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`firstname` varchar(191) NOT NULL,
	`lastname` varchar(191) NOT NULL,
	`gender` enum('male','female','non_binary','other') NOT NULL DEFAULT 'female',
	`completionYear` int NOT NULL,
	`broadDegreeCourse` varchar(191) NOT NULL,
	`university` varchar(191) NOT NULL,
	`degreeName` varchar(191) NOT NULL,
	`imageKey` varchar(191),
	`imageUrl` varchar(191),
	`clerkImageHash` varchar(191),
	`profileType` enum('STUDENT','ADMIN','EXPERT') NOT NULL DEFAULT 'STUDENT',
	`ethnicity` enum('english__welsh__scottish__northern_irish_or_british','irish','gypsy_or_irish_traveller','roma','any_other_white_background','caribbean','african','any_other_black__black_british__or_caribbean_background','indian','pakistani','bangladeshi','chinese','any_other_asian_background','white_and_black_caribbean','white_and_black_african','white_and_asian','any_other_mixed_or_multiple_ethnic_background','arab','any_other_ethnic_group') NOT NULL DEFAULT 'african',
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_clerkId_key` UNIQUE(`clerkId`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `_CareerInterestToUser` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_CareerInterestToUser_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE INDEX `Comment_authorId_threadId_groupId_idx` ON `Comment` (`authorId`,`threadId`,`groupId`);--> statement-breakpoint
CREATE INDEX `GroupUser_userId_groupId_idx` ON `GroupUser` (`userId`,`groupId`);--> statement-breakpoint
CREATE INDEX `Message_authorId_groupId_idx` ON `Message` (`authorId`,`groupId`);--> statement-breakpoint
CREATE INDEX `Reaction_authorId_messageId_commentId_idx` ON `Reaction` (`authorId`,`messageId`,`commentId`);--> statement-breakpoint
CREATE INDEX `Thread_authorId_messageId_groupId_idx` ON `Thread` (`authorId`,`messageId`,`groupId`);--> statement-breakpoint
CREATE INDEX `_CareerInterestToUser_B_index` ON `_CareerInterestToUser` (`B`);
*/