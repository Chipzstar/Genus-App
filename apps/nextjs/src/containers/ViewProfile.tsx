import React from "react";
import { MessagesSquare } from "lucide-react";

import { Button } from "@genus/ui/button";

import { env } from "~/env";
import { formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";

const { NEXT_PUBLIC_SUPPORT_ADMIN_USER } = env;

const ViewProfile = ({ profile }: { profile: UserProfile | undefined }) => {
	if (profile?.clerkId === NEXT_PUBLIC_SUPPORT_ADMIN_USER)
		return (
			<div className="flex h-full grow flex-col items-center justify-center">
				<Button
					variant="ghost"
					size="lg"
					onClick={() => {
						// @ts-expect-error chatwoot popup
						window.$chatwoot.toggle("open");
					}}
				>
					<MessagesSquare size={25} className="mr-3" /> Chat with Support
				</Button>
			</div>
		);
	return (
		<section className="flex h-full grow flex-col bg-white p-6">
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">University</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{formatString(profile?.university)}</span>
			</div>
			{profile?.profileType !== "admin" && (
				<div className="mb-4 flex flex-col">
					<span className="text-lg font-bold text-primary sm:text-xl">Broad Degree Category</span>
					<span className="text-sm text-black sm:text-base md:text-lg">
						{formatString(profile?.broadDegreeCourse)}
					</span>
				</div>
			)}
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Degree</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{formatString(profile?.degreeName)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Completion Year</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{profile?.completionYear}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Career Interests</span>
				<span className="text-sm text-black sm:text-base md:text-lg">
					{profile?.careerInterests?.map(item => formatString(item.slug)).join(", ")}
				</span>
			</div>
			<div className="flex h-10 grow flex-col items-center justify-center sm:h-32">
				<Button
					variant="ghost"
					size="lg"
					onClick={() => {
						// @ts-expect-error chatwoot popup
						window.$chatwoot.toggle("open");
					}}
				>
					<MessagesSquare size={25} className="mr-3" />
					<span className="text-lg sm:text-xl">Chat with Support</span>
				</Button>
			</div>
		</section>
	);
};

export default ViewProfile;
