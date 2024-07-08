import React from 'react'
import { HashLoader, PuffLoader } from 'react-spinners'

function MainSpinner() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <HashLoader color='#498FCD' size={80}/>
    </div>
  )
}

export default MainSpinner