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
				<span className="text-lg font-bold text-primary sm:text-xl">Name</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{`${profile?.firstname} ${profile?.lastname}`}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Age</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{profile?.age}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Role Sector</span>
				<span className="text-sm text-black sm:text-base md:text-lg">{formatString(profile?.roleSector)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-lg font-bold text-primary sm:text-xl">Hobby Interests</span>
				<span className="text-sm text-black sm:text-base md:text-lg">
					{profile?.hobbyInterests?.map(item => formatString(item.slug)).join(", ")}
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
