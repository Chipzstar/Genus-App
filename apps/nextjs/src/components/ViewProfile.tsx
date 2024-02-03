import React from "react";

import { capitalize, formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";

const ViewProfile = ({ profile }: { profile: UserProfile | undefined }) => {
	return (
		<section className="flex grow flex-col bg-white p-6">
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Profile Type</span>
				<span className="text-base text-black md:text-lg">{capitalize(profile?.profileType)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Gender</span>
				<span className="text-base text-black md:text-lg">{capitalize(profile?.gender)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">University</span>
				<span className="text-base text-black md:text-lg">{formatString(profile?.university)}</span>
			</div>
			<div className="mb-4 flex flex-col">
				<span className="text-xl font-bold text-primary">Broad Degree Category</span>
				<span className="text-base text-black md:text-lg">{formatString(profile?.broadDegreeCourse)}</span>
			</div>
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
		</section>
	);
};

export default ViewProfile;
