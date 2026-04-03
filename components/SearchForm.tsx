// components/SearchForm.tsx
import React from 'react'
import Form from "next/form"
import SearchFormReset from './SearchFormReset'
import { Search } from 'lucide-react'

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/" scroll={false} className='search-form max-sm:mx-4'>
      <input
        type="text"
        name='query'
        className='search-input'
        defaultValue={query}
        placeholder='Search projects...'
      />

      <div className='flex gap-2 items-center'>
        {query && <SearchFormReset />}
        <button type='submit' className='search-btn text-white cursor-pointer hover:bg-black/80 transition-colors'>
          <Search size={24} />
        </button>
      </div>
    </Form>
  )
}

export default SearchForm