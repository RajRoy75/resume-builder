import React from 'react'
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import { getTemplateDetails, saveToCollection, saveToFavourite } from '../api';
import MainSpinner from '../components/MainSpinner';
import { FaHouse } from 'react-icons/fa6';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplate from '../hooks/useTemplate';
import TemplateDesign from '../components/TemplateDesign';
import { AnimatePresence } from 'framer-motion';

function TemplateDesigns() {
  const { data: user, refetch: userRefetch } = useUser();
  const {data:templates, refetch:templatesRefetch} = useTemplate();
  const { templateId } = useParams();
  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateId],
    () => getTemplateDetails(templateId)
  )
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  }
  const addToFavourite = async (e) => {
    e.stopPropagation();
    await saveToFavourite(user, data);
    refetch();
    templatesRefetch();
  }
  if (isLoading) return <MainSpinner />

  if (isError) return (
    <div className='flex w-full h-[60vh] flex-col items-center justify-center'>
      <p className='text-lg text-txtPrimary font-semibold'>Error while fetching the data...please try again</p>
    </div>
  )
  return (
    <div className='w-full flex justify-start items-center flex-col px-4 py-12'>
      {/* bread crump */}
      <div className='w-full flex items-center pb-8 gap-2'>
        <Link
          to={'/'}
          className='flex items-center justify-center gap-2 text-txtPrimary'>
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>
      {/* main section layout */}
      <div className='grid grid-flow-col-1 lg:grid-cols-12 w-full'>
        {/* left side */}
        <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
          <img src={data?.imageUrl} className='w-full h-auto object-contain rounded-md' alt="" />
          <div className='w-full flex flex-col items-start justify-start gap-2'>
            <div className='w-full flex items-center justify-between'>
              <p className='text-base text-txtPrimary font-semibold'>{data?.tittle}</p>
              {data?.favourites?.length > 0 && (
                <div className='flex items-center justify-center gap-1'>
                  <BiSolidHeart className='text-base text-red-500' />
                  <p className='text-base text-txtPrimary font-semibold'>{data?.favourites?.length}</p>
                </div>
              )}

            </div>
            {user && (
              <div className='flex items-center justify-center gap-3'>
                {user?.collections?.includes(data._id) ? (
                  <React.Fragment>
                    <div onClick={addToCollection} className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                      <BiSolidFolderPlus className='text-base text-txtPrimary' />
                      <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove from collections</p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div onClick={addToCollection} className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                      <BiFolderPlus className='text-base text-txtPrimary' />
                      <p className='text-sm text-txtPrimary whitespace-nowrap'>Add to collections</p>
                    </div>
                  </React.Fragment>
                )}
                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div onClick={addToFavourite} className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                      <BiSolidHeart className='text-base text-txtPrimary' />
                      <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove from favourites</p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div onClick={addToFavourite} className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                      <BiHeart className='text-base text-txtPrimary' />
                      <p className='text-sm text-txtPrimary whitespace-nowrap'>Add to favourites</p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>
        {/* right side */}
        <div className='col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start gap-6 px-3'>
          <div className='w-full h-72 bg-slate-500 rounded-md overflow-hidden relative' style={{ background: "url(https://cdn.pixabay.com/photo/2023/10/19/15/18/mountains-8326967_640.jpg)", backgroundPosition: "center", backgroundSize: "cover" }}>
            <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]'>
              <Link to={'/'} className='border-2 border-gray-50 px-4 py-2 rounded-md text-white'>Discover More</Link>
            </div>
          </div>
          {user && (
            <Link to={`/resume/${data?.name}?templateId=${data?._id}`} className='w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer'>
              <p className='text-white font-semibold text-lg'>Edit this template</p>
            </Link>
          )}
          <div className='w-full flex items-center justify-start flex-wrap gap-2'>
            {data?.tags?.map((tag,index)=>(
              <p key={index} className='text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap cursor-pointer'>{tag}</p>
            ))}
          </div>
        </div>
      </div>
      {/* templates suggestion */}
      {templates.length > 0 &&(
        <div className='w-full py-8 flex flex-col items-start justify-start gap-4'>
          <p className='text-lg font-semibold text-txtDark'>You might also like</p>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
          <React.Fragment>
    {templates && templates?.length > 0 ? (
      <>
        <AnimatePresence>
          {templates?.filter((temp)=> temp._id !== data?._id).map((template,index)=>(
            <TemplateDesign key={template?._id} data={template} index={index}/>
          ))}
        </AnimatePresence>
      </>
    ):(
      <p className='text-txtDark'>No other templates to suggest</p>
    )}
  </React.Fragment>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateDesigns