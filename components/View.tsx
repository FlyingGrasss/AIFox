// components/View.tsx
import React from 'react'
import Ping from './Ping'
import { client } from '@/sanity/lib/client'
import { PROJECT_VIEWS_QUERY } from '@/sanity/lib/queries'
import { writeClient } from '@/sanity/lib/write-client'
import { after } from "next/server"

const View = async ({ id }: {id: string}) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_VIEWS_QUERY, { id });

  const totalViews = result?.views || 0;

  after(async () => {
    await writeClient
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();
  });

  return (
    <div className='view-container'>
      <div className='relative'>
        <div className='absolute -top-1 -right-1'>
          <Ping />
        </div>
        <p className='view-text'>
          <span className='font-bold'>
            {totalViews} {totalViews === 1 ? "view" : "views"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default View