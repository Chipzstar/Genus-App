import {Navbar, NavbarBrand} from '@nextui-org/react'
import {useRouter} from 'next/router'
import React, {ReactElement, useEffect} from 'react'
import AppLayout from '~/layout/AppLayout'
import Image from 'next/image'
import {ChevronLeft} from 'lucide-react'
import {GetStaticProps} from 'next'
import {getAllInsightsSlugs, getClient, getInsightAndBody} from '~/lib/sanity.client'
import {Insight} from '~/lib/sanity.queries'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import {urlForImage} from '~/lib/sanity.image'

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
  console.log(insight.mainImage)
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
  const { insight: {body, mainImage, title}} = props

  useEffect(() => {
    console.log(urlForImage(mainImage).height(100).width(150).url())
  }, [mainImage])

  const router = useRouter()
  const {slug} = router.query
  return (
    <div className="insights-container overflow-y-hidden">
      <Navbar classNames={{
        base: 'p-3 text-white bg-[#757882]/50',
        brand: 'w-full flex flex-col justify-center items-center space-y-1'
      }}>
        <NavbarBrand>
          <div className="absolute left-0 top-0" role="button" onClick={router.back}>
            <ChevronLeft size={40} color="#2AA6B7" />
          </div>
          <div className="flex flex-col items-center justify-center grow space-y-3">
            <Image
              className="h-auto"
              height={100 * 1.5}
              width={150 * 1.5}
              alt=""
              src={urlForImage(mainImage).height(300).width(450).url()}
              sizes="100vw"
              priority
            />
            <header className="font-bold text-xl sm:text-3xl text-center whitespace-pre-wrap text-black sm:w-144">{title}</header>
          </div>
        </NavbarBrand>
      </Navbar>
      <section className="flex flex-col items-center px-4">
        <div className="sm:px-6 py-10 text-lg">
          <PortableText
            value={body}
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
