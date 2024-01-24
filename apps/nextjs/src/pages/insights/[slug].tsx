import {Navbar, NavbarBrand} from '@nextui-org/react'
import {useRouter} from 'next/router'
import React, {FC, ReactElement} from 'react'
import AppLayout from '~/layout/AppLayout'
import {PATHS} from '~/utils'
import Image from 'next/image'
import {ChevronLeft} from 'lucide-react'
import {GetStaticProps} from 'next'
import {getAllInsightsSlugs, getClient, getInsightAndBody, getInsightBySlug} from '~/lib/sanity.client'
import {Insight} from '~/lib/sanity.queries'
import {PortableText, PortableTextComponents} from '@portabletext/react'

interface PageProps {
  insight: Insight
}

interface Query {
  [key: string]: string
}

export const getStaticPaths = async () => {
  const slugs = await getAllInsightsSlugs()
  console.log(slugs)

  return {
    paths: slugs?.map(({slug}) => `/insights/${slug}`) || [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const {params = {}} = ctx
  const slug = params.slug as string
  const client = getClient()

  const {insight} = await getInsightAndBody(client, slug)
  insight.body.forEach((paragraph: any) => console.log(paragraph.children))
  if (!insight) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      insight,
      token: ''
    }
  }
}

const components: PortableTextComponents  = {
  types: {

    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
  marks: {
    color: (res) => {
      const {value, text, ...rest} = res;
      return <span style={{color: value['hex']}}>{text}</span>
    }
  }
}

const InsightSlug = (props: PageProps) => {
  const router = useRouter()
  const {slug} = router.query
  return (
    <div className="page-container bg-white overflow-y-hidden">
      <Navbar classNames={{
        base: 'px-3 pb-3 text-white',
        brand: 'w-full flex flex-col justify-center items-center space-y-1'
      }}>
        <NavbarBrand>
          <div className="absolute left-0" role="button" onClick={router.back}>
            <ChevronLeft size={40} color="#2AA6B7" />
          </div>
          <div role="button" onClick={() => router.push(PATHS.HOME)}>
            <Image src="/images/green-logo.svg" alt="genus-white" width={100} height={75} />
          </div>
        </NavbarBrand>
      </Navbar>
      <section className="flex flex-col items-center">
        <header className="font-bold text-4xl text-center text-black sm:w-144">{props.insight.title}</header>
        <div className="sm:px-6 py-10 text-lg">
          <PortableText
            value={props.insight.body}
            components={components}
          />
        </div>
      </section>
    </div>
  )
}

InsightSlug.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default InsightSlug
