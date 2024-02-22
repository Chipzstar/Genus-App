import type { ReactElement } from "react";
import React from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { ChevronLeft } from "lucide-react";

import AppLayout from "~/layout/AppLayout";
import { getAllInsightsSlugs, getClient, getInsightAndBody } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import type { Insight } from "~/lib/sanity.queries";

interface PageProps {
	insight: Insight;
}

type Query = Record<string, string>;

export const getStaticPaths = async () => {
	const slugs = await getAllInsightsSlugs();
	return {
		paths: slugs?.map(({ slug }) => `/insights/${slug}`) || [],
		fallback: "blocking"
	};
};

export const getStaticProps: GetStaticProps<PageProps, Query> = async ctx => {
	const { params = {} } = ctx;
	const slug = params.slug!;
	const client = getClient();

	const { insight } = await getInsightAndBody(client, slug);
	if (!insight) {
		return {
			notFound: true
		};
	}

	return {
		props: {
			insight,
			token: ""
		}
	};
};

const components: PortableTextComponents = {
	types: {
		// Any other custom types you have in your content
		// Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
	},
	block: {
		h1: ({ children }) => <h1 className="my-3 text-h1">{children}</h1>,
		h2: ({ children }) => <h2 className="my-3 text-h2">{children}</h2>,
		h3: ({ children }) => <h3 className="my-2.5 text-h3">{children}</h3>,
		h4: ({ children }) => <h4 className="my-2 text-h4">{children}</h4>,
		normal: ({ children }) => <p className="text-normal mt-4">{children}</p>,
		blockquote: ({ children }) => <blockquote>{children}</blockquote>
	},
	list: {
		bullet: ({ children }) => <ul className="mt-unit-md list-inside">{children}</ul>,
		number: ({ children }) => <ol className="mt-unit-md list-inside">{children}</ol>
	},
	listItem: {
		bullet: ({ children }) => <li className="list-disc">{children}</li>,
		number: ({ children }) => <li className="list-decimal">{children}</li>
	},
	marks: {
		color: res => {
			const { value, text } = res;
			return <span style={{ color: value.hex }}>{text}</span>;
		}
	}
};

const InsightSlug = (props: PageProps) => {
	const router = useRouter();

	const {
		insight: { body, mainImage, title }
	} = props;
	return (
		<div className="insights-container overflow-y-hidden">
			<Navbar
				classNames={{
					base: "p-3 text-white flex justify-center",
					wrapper: "mx-auto max-w-3xl",
					brand: "w-full flex flex-col justify-center items-center space-y-1"
				}}
			>
				<NavbarBrand>
					<div className="absolute left-0 top-0" role="button" onClick={router.back}>
						<ChevronLeft size={40} color="white" />
					</div>
					<div className="flex grow flex-col items-center justify-center space-y-3">
						<object
							className="mx-auto h-36 w-44 sm:h-52 sm:w-76"
							type="image/svg+xml"
							data={urlForImage(mainImage).height(300).width(450).url()}
						/>
						{/*<Image
						  className="h-auto"
						  height={100 * 1.5}
						  width={150 * 1.5}
						  alt=""
						  src={urlForImage(mainImage).height(300).width(450).url()}
						  sizes="100vw"
						  priority
						/>*/}
						<header className="whitespace-pre-wrap text-center text-xl font-bold text-white sm:w-144 sm:text-3xl">
							{title}
						</header>
					</div>
				</NavbarBrand>
			</Navbar>
			<section className="flex h-full flex-col items-center bg-white px-4">
				<div className="mx-auto max-w-3xl py-10 text-lg sm:px-6">
					<PortableText value={body!} components={components} />
				</div>
				<br />
				<br />
			</section>
		</div>
	);
};

InsightSlug.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default InsightSlug;
