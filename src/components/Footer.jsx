import React from 'react'
import { Logo } from '../assets'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='flex border-t items-center justify-between w-full border-gray-300'>
        <div className='flex items-center justify-center gap-3 py-3'>
        <img src={Logo} alt="error" className='w-8 h-auto object-contain'/>
        <p className='text-gray-400'>Express Resume</p>
        </div>
        <div className='flex gap-6 items-center justify-center'>
            <Link to = {'/'} className='text-blue-700 text-sm'>Home</Link>
            <Link to = {'/'} className='text-blue-700 text-sm'>Contact</Link>
            <Link to = {'/'} className='text-blue-700 text-sm whitespace-nowrap'>Privacy Policy</Link>
        </div>
    </div>
  )
}

export default Footer