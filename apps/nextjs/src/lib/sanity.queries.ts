import { groq } from "next-sanity";

const insightFields = groq`
  _id,
  title,
  publishedAt,
  _updatedAt,
  categories,
  mainImage,
  "slug": slug.current,
  "author": author->{name, image},
`;

const companyFields = groq`
	_id,
    title,
    "slug": slug.current,
    "category": category->{title, slug},
    mainImage,
    publishedAt,
    _updatedAt,
`;

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const allInsightsQuery = groq`
*[_type == "insight"] | order(date desc, _updatedAt desc) {
  ${insightFields}
}`;

export const allGroupsQuery = groq`
*[_type == "group"] | order(date desc, _updatedAt desc) {
  ${insightFields}
}`;

export const allCompaniesQuery = groq`
*[_type == "company"] | order(date desc, _updatedAt desc) {
  ${companyFields}
}`;

export const insightAndBodyQuery = groq`
{
  "insight": *[_type == "insight" && slug.current == $slug] | order(_updatedAt desc) [0] {
    body,
    ${insightFields}
  }
}`;

export const insightSlugsQuery = groq`
*[_type == "insight" && defined(slug.current)][].slug.current
`;

export const insightBySlugQuery = groq`
*[_type == "insight" && slug.current == $slug][0] {
  ${insightFields}
}
`;

export const companyBySlugQuery = groq`
*[_type == "company" && slug.current == $slug][0] {
  ${companyFields}
}`;

interface InsightImage {
	type: string;
	asset: {
		_ref: string;
		type: string;
	};
}

export interface Author {
	name?: string;
	slug?: string;
	image?: never;
}

export interface Category {
	title: string;
	slug: {
		_type: "slug";
		current: string;
	};
	description?: never;
}

export interface Insight {
	_id: string;
	title: string;
	slug: string;
	mainImage: InsightImage;
	author?: Author;
	publishedAt?: string;
	_updatedAt?: string;
	categories?: string;
	body?: never;
}

export type Group = Omit<Insight, "body">;

export type Company = Omit<Insight, "body" | "author"> & { category: Category };

export interface Settings {
	title?: string;
	description?: never[];
	ogImage?: {
		title?: string;
	};
}
