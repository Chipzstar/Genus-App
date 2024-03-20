import React from "react";

import { formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";
import { Button } from "@genus/ui/button";
import { MessagesSquare } from 'lucide-react'

const ViewProfile = ({ profile }: { profile: UserProfile | undefined }) => {
	return (
		<section className="flex grow flex-col bg-white p-6 h-full">
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">University</span>
				<span className="text-base text-black md:text-lg">{formatString(profile?.university)}</span>
			</div>
			{profile?.profileType !== "ADMIN" && <div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Broad Degree Category</span>
				<span className="text-base text-black md:text-lg">{formatString(profile?.broadDegreeCourse)}</span>
			</div>}
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Degree</span>
				<span className="text-base text-black md:text-lg">{formatString(profile?.degreeName)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Completion Year</span>
				<span className="text-base text-black md:text-lg">{profile?.completionYear}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Career Interests</span>
				<span className="text-base text-black md:text-lg">
					{profile?.careerInterests?.map(item => formatString(item.slug)).join(", ")}
				</span>
			</div>
			<div className="flex flex-col grow justify-center items-center h-32">
				<Button variant="ghost" size="lg" onClick={() => {
					// @ts-expect-error chatwoot popup
					window.$chatwoot.toggle("open");
				}}>
					<MessagesSquare size={25} className="mr-3" /> Chat with Support
				</Button>
			</div>
		</section>
	);
};

export default ViewProfile;
