import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { Page } from '@/payload-types'

import config from '@/payload.config'
import './styles.css'
import { json } from 'stream/consumers'
import Link from 'next/link'

import ContentBlock from './components/ContentBlock'
import HeroBlock from './components/HeroBlock'
import NewsletterBlock from './components/NewsletterBlock'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'landing-page' },
    },
  })

  const renderBlocks = (block: Page['layout'][0]) => {
    switch (block.blockType) {
      case 'hero':
        return <HeroBlock block={block} key={block.id} />
      case 'content':
        return <ContentBlock block={block} key={block.id} />
      case "newsletter-form":
        return <NewsletterBlock block={block} key={block.id} />
      default:
        return null
    }
  }

  return (
    <div className='p-4'>
      {/* {page.title} */}
      {/* <div className='page'>{page.layout?.map((block) => renderBlocks(block))}</div> */}
      <Link href={"/search"} className='underline decoration-2 decoration-blue-400'>Search</Link>
    </div>
  )
}
