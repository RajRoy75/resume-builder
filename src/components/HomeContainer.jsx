import React from 'react'
import Filter from './Filter';
import useTemplate from '../hooks/useTemplate';
import MainSpinner from './MainSpinner';
import { AnimatePresence } from 'framer-motion';
import TemplateDesign from './TemplateDesign';

function HomeContainer() {
  const {
    data: templates,
    isLoading: templateIsLoading,
    isError: templateIsError,
    refetch: templateRefetch } = useTemplate();
  if (templateIsLoading) {
    return <MainSpinner />;
  }
  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-center'>
      {/* Filter Section */}
      <Filter />
      {/* Templates Showcase */}
      {templateIsError ? (
        <>
          <p className='text-lg text-txtDark'>Something went wrong... Please try again</p>
        </>
      ) : (
        <>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
            <RenderATemplate template={templates}/>
          </div>
        </>
      )}
    </div>
  )
}
const RenderATemplate = ({template})=>{
  return (
    <React.Fragment>
    {template && template?.length > 0 ? (
      <>
        <AnimatePresence>
          {template && template.map((template,index)=>(
            <TemplateDesign key={template?._id} data={template} index={index}/>
          ))}
        </AnimatePresence>
      </>
    ):(
      <p className='text-txtDark'>Templates are not found</p>
    )}
  </React.Fragment>
  )
  
}

export default HomeContainer