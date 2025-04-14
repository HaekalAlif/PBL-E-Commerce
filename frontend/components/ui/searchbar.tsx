'use client'

import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const Searchbar: React.FC = () => {
    const [activeSearch, setActiveSearch] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    const sampleWords = ["apple", "banana", "cherry", "grape", "orange", "pineapple", "strawberry", "watermelon"]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setSearchTerm(value)

        if (value === '') {
            setActiveSearch([])
            return
        }

        setActiveSearch(sampleWords.filter((w) => w.toLowerCase().includes(value.toLowerCase())).slice(0, 8))
    }

    const SearchIcon = () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          text-color="white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4999 17.5L13.8749 13.875"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    return (
        <form className='w-full relative'>
            <div className="relative">
                <input
                    type="search"
                    placeholder='Cari Barang'
                    className='w-full p-4 rounded-full bg-white border-2 border-gray-300 text-black focus:border-[#F79E0E] focus:outline-none'
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit" className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-[#F79E0E] rounded-full'>
                    <SearchIcon/>
                </button>
            </div>

            {activeSearch.length > 0 && (
                <div className="absolute top-20 p-4 bg-slate-800 text-black w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
                    {activeSearch.map((s, index) => (
                        <span key={index}>{s}</span>
                    ))}
                </div>
            )}
        </form>
    )
}

export default Searchbar
