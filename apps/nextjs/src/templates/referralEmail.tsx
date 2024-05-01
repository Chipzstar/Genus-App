import * as React from "react";

interface EmailTemplateProps {
	formUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ formUrl }) => (
	<div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
		<h1 className="text-xl font-semibold text-gray-900">Hey there!</h1>
		<p className="text-md mt-2 text-gray-700">
			{
				"We're thrilled to have you as part of the Genus community. We constantly strive to improve, and your feedback is invaluable to us."
			}
		</p>
		<p className="text-md mt-2 text-gray-700">
			Could you spare a few moments to fill out a review? Your insights will help us enhance your experience.
		</p>
		<a
			href={formUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="mt-4 inline-block rounded bg-secondary px-4 py-2 font-bold text-white hover:bg-secondary-400"
		>
			Fill in Review
		</a>
		<p className="mt-4 text-sm text-gray-600">
			Thank you for your time and support. We look forward to reading your feedback!
		</p>
	</div>
);
