import React from 'react'
import { Logo } from '../assets'
import Footer from '../components/Footer';
import AuthButton from '../components/AuthButton';
import {FaGoogle,FaGithub} from 'react-icons/fa6'


function AuthPage() {
  return (
    <div className='auth-section'>
      {/* top section */}
      <img src={Logo} alt="error" className='w-12 h-auto object-contain'/>
      {/* body section  */}
      <div className='w-full flex flex-col flex-1 gap-6 items-center justify-center'>
        <h1 className='text-3xl lg:text-4xl text-blue-700'>Welcome to Express Resume</h1>
        <p className='text-base text-gray-600'>express way to create resume</p>
        <h2 className='text-2xl text-gray-700'>Authenticate</h2>
        <div className='flex flex-col lg:w-96 w-full justify-start items-center gap-6 '>
          <AuthButton Icon = {FaGoogle} label = {'Signin with Google'} provider = {'GoogleAuthProvider'}/>
          <AuthButton Icon={FaGithub} label={"Signin with Github"} provider={'GitHubAuthProvider'}/>
        </div>
      </div>
      {/* footer secton  */}
    	<Footer/>
    </div>
  )
}

export default AuthPage