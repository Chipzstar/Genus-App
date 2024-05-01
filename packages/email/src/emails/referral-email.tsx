import * as React from "react";
import { Body, Head, Html, Link } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
	formUrl?: string;
}

export const ReferralEmail: React.FC<Readonly<EmailTemplateProps>> = ({
	formUrl = "https://genusnetworks.fillout.com/review"
}) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="mx-auto my-auto bg-white px-2 font-sans">
				<div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
					<h1 className="text-xl font-semibold text-gray-900">Hey there!</h1>
					<p className="mt-2 text-base text-gray-700">
						{
							"We're thrilled to have you as part of the Genus community. We constantly strive to improve, and your feedback is invaluable to us."
						}
					</p>
					<p className="mt-2 text-base text-gray-700">
						Could you spare a few moments to fill out a review? Your insights will help us enhance your
						experience.
					</p>
					<Link
						role="button"
						href={formUrl}
						target="_blank"
						className="mt-4 inline-block rounded bg-[#2CEFD8] px-4 py-2 font-bold text-white hover:bg-[#52F2DF]"
					>
						Fill in Review
					</Link>
					<p className="mt-4 text-sm text-gray-600">
						Thank you for your time and support. We look forward to reading your feedback!
					</p>
				</div>
			</Body>
		</Tailwind>
	</Html>
);

export default ReferralEmail;
