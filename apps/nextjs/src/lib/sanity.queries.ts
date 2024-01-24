import { groq } from 'next-sanity'

const insightFields = groq`
  _id,
  title,
  publishedAt,
  _updatedAt,
  categories,
  mainImage,
  "slug": slug.current,
  "author": author->{name, image},
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "insight"] | order(date desc, _updatedAt desc) {
  ${insightFields}
}`

export const insightAndBodyQuery = groq`
{
  "insight": *[_type == "insight" && slug.current == $slug] | order(_updatedAt desc) [0] {
    body,
    ${insightFields}
  }
}`

export const insightSlugsQuery = groq`
*[_type == "insight" && defined(slug.current)][].slug.current
`

export const insightBySlugQuery = groq`
*[_type == "insight" && slug.current == $slug][0] {
  ${insightFields}
}
`

export interface Author {
  name?: string
  slug?: string
  image?: any
}

export interface Insight {
  _id: string
  title?: string
  slug?: string
  author?: Author
  mainImage?: any
  publishedAt?: string
  _updatedAt?: string
  categories?: string
  body?: any
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}
