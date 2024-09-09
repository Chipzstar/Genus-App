import React from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/image";

import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { PATHS } from "~/utils";

const Church = () => {
	const router = useRouter();
	return (
		<div className="page-container overflow-y-hidden">
			<TopNav />
			<div className="mx-auto max-w-3xl">
				<section className="flex w-full flex-col items-center justify-center bg-gradient-radial from-primary from-25% to-secondary-300 py-6">
					<div className="flex h-32 w-32">
						<Image src="/images/arc2.0-avatar.png" width="100%" height="100%" />
					</div>
					<div className="flex flex-col space-y-4 text-center text-white">
						<h2 className="text-3xl font-bold drop-shadow-md md:text-4xl">Arc 2.0</h2>
						<span className="text-pretty px-4 text-lg font-semibold tracking-tight md:text-xl">
							Knowing Jesus and making Jesus known
						</span>
					</div>
				</section>
				<div className="flex h-full w-full flex-col space-y-8 text-center">
					<section className="flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5] py-1">
						<Link href="https://www.instagram.com/arc2uk/?hl=en" target="_blank" rel="noopener noreferrer">
							<div className="h-8 w-8">
								<Image src="/images/instagram.png" />
							</div>
						</Link>
						<Link
							href="https://m.youtube.com/channel/UCWtCb3ntEOJydQMsbPjUYyQ"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="h-8 w-8">
								<Image src="/images/youtube.png" />
							</div>
						</Link>
						<Link href="mailto:admin@arcglobalchurches.com" target="_blank" rel="noopener noreferrer">
							<div role="button" className="h-8 w-8">
								<Image src="/images/email.png" />
							</div>
						</Link>
					</section>

					<section className="flex flex-col px-5">
						<article
							role="button"
							className="flex items-center justify-between"
							onClick={() => router.push(PATHS.MEMBERS)}
						>
							<div className="flex items-center space-x-3">
								<Image src="/images/member.png" width={50} />
								<span className="text-wrap text-xl font-semibold md:text-2xl">Member directory</span>
							</div>
							<Image src="/static/forward-arrow.png" width={12} />
						</article>
						<hr className="my-3" />
						<article
							role="button"
							className="flex items-center justify-between"
							onClick={() => router.push(PATHS.BUSINESS)}
						>
							<div className="flex items-center space-x-3">
								<Image src="/images/business.png" width={50} />
								<span className="text-wrap text-xl font-semibold md:text-2xl">Business directory</span>
							</div>
							<Image src="/static/forward-arrow.png" width={12} />
						</article>
						<hr className="my-3" />

						<article
							role="button"
							className="flex w-full items-center justify-between"
							onClick={() => router.push(PATHS.RECOMMEND)}
						>
							<div className="flex items-center space-x-3">
								<Image src="/images/share.png" width={50} />
								<span className="text-wrap text-start text-xl font-semibold md:text-2xl">
									Share & Recommend
								</span>
							</div>
							<Image src="/static/forward-arrow.png" width={12} />
						</article>
					</section>
				</div>
			</div>
		</div>
	);
};

Church.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Church;
