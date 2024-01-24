import {createClient, type SanityClient} from 'next-sanity'
import {apiVersion, dataset, projectId, studioUrl, useCdn, readToken} from '~/lib/sanity.api'
import {indexQuery, Insight, insightAndBodyQuery, insightBySlugQuery, insightSlugsQuery} from '~/lib/sanity.queries'

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    token: readToken,
    apiVersion,
    useCdn,
    perspective: 'published',
    encodeSourceMap: !!preview?.token,
    studioUrl,
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}

export async function getAllInsights(client: SanityClient): Promise<Insight[]> {
  return (await client.fetch(indexQuery)) || []
}

export async function getAllInsightsSlugs(): Promise<Pick<Insight, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(insightSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}

export async function getInsightBySlug(
  client: SanityClient,
  slug: string,
): Promise<Insight> {
  return (await client.fetch(insightBySlugQuery, { slug })) || ({} as any)
}

export async function getInsightAndBody(
  client: SanityClient,
  slug: string,
): Promise<{ insight: Insight; body: Pick<Insight, "body">[] }> {
  return await client.fetch(insightAndBodyQuery, { slug })
}

