import { defineField, defineType } from "sanity";

export default defineType({
	name: "company",
	title: "Company",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string"
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96
			}
		}),
		defineField({
			name: "mainImage",
			title: "Main image",
			type: "image",
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			to: { type: "category" },
			validation: Rule => Rule.required()
		}),
		defineField({
			name: "publishedAt",
			title: "Published at",
			type: "datetime"
		})
	],
	preview: {
		select: {
			title: "title",
			category: "category.title",
			media: "mainImage"
		},
		prepare(selection) {
			const { category } = selection;
			return { ...selection, subtitle: category };
		}
	}
});
