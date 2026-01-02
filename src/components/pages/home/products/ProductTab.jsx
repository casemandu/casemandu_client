'use client'
import React, { useState } from 'react'

const ProductTab = ({ displayBy, setDisplayBy, tabs }) => {
  return (
    <div className='flex flex-wrap sm:gap-7'>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setDisplayBy(tab.value)}
          className={`${
            displayBy === tab.value ? 'bg-primary text-white' : 'text-black'
          } px-5 py-2 rounded-md text-sm font-medium`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}

export default ProductTab
