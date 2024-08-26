import React from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/image";

import AppLayout from "~/layout/AppLayout";
import { PATHS } from "~/utils";

const Church = () => {
	const router = useRouter();
	return (
		<div className="church-container overflow-y-hidden">
			<div className="relative flex h-full flex-col bg-white">
				<div className="mx-auto max-w-xl">
					<img src="/images/arc2.0-banner.png" className="w-full md:h-48" />
					<div className="absolute left-1/2 top-32 z-10 flex h-28 w-28 -translate-x-1/2 transform flex-col md:h-32 md:w-32">
						<Image src="/images/arc2.0-avatar.png" width="100%" height="100%" />
					</div>
					<div className="mt-20 flex h-full w-full flex-col space-y-8 text-center">
						<div className="flex flex-col space-y-4">
							<h2 className="px-4 text-3xl font-bold md:text-4xl">Arc 2.0</h2>
							<span className="text-pretty px-4 text-lg font-semibold tracking-tight md:text-xl">
								Knowing Jesus and making Jesus known
							</span>
						</div>
						<section className="flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5]">
							<div role="button">
								<Image src="/images/instagram.svg" />
							</div>
							<div role="button">
								<Image src="/images/tiktok.svg" />
							</div>
							<div role="button">
								<Image src="/images/youtube.svg" />
							</div>
							<div role="button">
								<Image src="/images/email.svg" />
							</div>
						</section>
						<section className="flex h-48 flex-col">
							<div className="flex h-full gap-x-6 px-4">
								<article
									role="button"
									className="flex items-center space-x-3"
									onClick={() => router.push(PATHS.MEMBERS)}
								>
									<Image src="/images/member.svg" width={75} />
									<span className="text-wrap text-xl font-semibold md:text-2xl">
										Member directory
									</span>
								</article>
								<div className="flex flex-col border" />
								<article
									role="button"
									className="flex items-center space-x-3"
									onClick={() => router.push(PATHS.BUSINESSES)}
								>
									<Image src="/images/business.svg" width={75} />
									<span className="text-wrap text-xl font-semibold md:text-2xl">
										Business directory
									</span>
								</article>
							</div>
							<hr className="my-3" />
							<div className="mt-2 flex">
								<article role="button" className="flex w-full items-center justify-center space-x-3">
									<Image src="/images/share.svg" width={60} />
									<span className="text-wrap text-start text-xl font-semibold md:text-2xl">
										Share & Recommend
									</span>
								</article>
							</div>
						</section>
					</div>
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
