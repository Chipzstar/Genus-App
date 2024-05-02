import * as React from "react";
import { Body, Head, Html, Img, Link } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
	formUrl: string;
	referrerName: string;
	instagram?: string;
	linkedin?: string;
	tiktok?: string;
}

type ReferralEmailPreviewProps = EmailTemplateProps;

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000";
console.log(baseUrl);

export const ReferralEmail = ({
	linkedin,
	tiktok,
	instagram,
	formUrl = "https://genusnetworks.fillout.com/review",
	referrerName
}: EmailTemplateProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="mx-auto my-auto bg-white px-2 font-sans">
				<div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
					<h1 className="text-xl font-semibold text-gray-900">Hey there!</h1>
					<p className="mt-2 text-base text-gray-700">
						We’re Genus an emerging careers guidance platform, helping students gain real and practical
						insights towards finding and securing the right corporate role for them”. {referrerName},
						recently helped us share their internship/graduate experience! They recommended you as someone
						who would be perfect in sharing your experience(s) (don’t worry, it’s all anonymous)!
					</p>
					<p className="mt-2 text-base text-gray-700">
						It would be amazing to fill out your review below (it only takes c.6 mins) - you could even be
						in the chance of winning £50! 🤩
					</p>
					<p className="mt-2 text-base text-gray-700">
						Do check out (and follow) below our socials for valuable career insights across Banking &
						Finance, Consulting & Tech. 📈
					</p>
					<Link
						role="button"
						href={formUrl}
						target="_blank"
						className="mt-4 inline-block rounded bg-[#2CEFD8] px-4 py-2 font-bold text-white hover:bg-[#52F2DF]"
					>
						Fill in Review
					</Link>
					<p className="mt-4 text-sm text-gray-600">From the Genus Team</p>
					<section className="flex gap-x-4">
						<Link href="https://www.instagram.com/genusnetworks/" target="_blank" role="button">
							<Img src={instagram} width="32" height="32" alt="instagram" />
						</Link>
						<Link href="https://www.linkedin.com/company/genusnetworks/" target="_blank" role="button">
							<Img src={linkedin} width="32" height="32" alt="linkedin" />
						</Link>
						<Link role="button" href="https://www.tiktok.com/@genusnetworks/" target="_blank">
							<Img src={tiktok} width="32" height="32" alt="tiktok" />
						</Link>
					</section>
				</div>
			</Body>
		</Tailwind>
	</Html>
);

ReferralEmail.PreviewProps = {
	instagram: `${baseUrl}/static/instagram.png`,
	linkedin: `${baseUrl}/static/linkedin.png`,
	tiktok: `${baseUrl}/static/tiktok.png`
} as ReferralEmailPreviewProps;

export default ReferralEmail;
