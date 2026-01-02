import React from 'react'

const Breadcrumb = ({ pages }) => {
  return (
    <ol
      className='flex items-center justify-center gap-3 whitespace-nowrap'
      aria-label='Breadcrumb'
    >
      <li className='inline-flex items-center'>
        <a
          className='flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600'
          href='#'
        >
          Home
        </a>
        <span className='ms-2'>/</span>
      </li>

      {pages?.map((page, index) => (
        <li key={index} className='inline-flex items-center'>
          <a
            className='flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600'
            href='#'
          >
            {page}
          </a>
          <span className='ms-2'>/</span>
        </li>
      ))}

      <li className='inline-flex items-center'>
        <a
          className='flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600'
          href='#'
        >
          App Center
        </a>
        <span className='ms-2'>/</span>
      </li>
      <li
        className='inline-flex items-center text-sm font-semibold text-gray-800 truncate '
        aria-current='page'
      >
        Application
      </li>
    </ol>
  )
}

export default Breadcrumb
