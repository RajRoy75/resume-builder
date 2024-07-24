import React, { Suspense } from 'react';
import Header from '../components/Header';
import HomeContainer from '../components/HomeContainer';
import { Route, Routes } from 'react-router-dom';
import CreateTemplate from './CreateTemplate';
import UserProfile from './UserProfile';
import TemplateDesigns from './TemplateDesigns';
import CreateResume from './CreateResume';


function HomePage() {

  return (<>
    <div className='w-full flex flex-col justify-center items-center'>
      <Header />
    </div>
    <main>
      <Suspense>
        <Routes>
          <Route path='/' element={<HomeContainer />} />
          <Route path='/template/create' element={<CreateTemplate />} />
          <Route path='/profile/:uid' element={<UserProfile />} />
          <Route path='/resumeDetail/:templateId' element={<TemplateDesigns />} />
          <Route path='/resume/*' element={<CreateResume />} />
        </Routes>
      </Suspense>
    </main>
  </>

  )
}

export default HomePage