import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { fadeInOutWithOpacity, popInOutWithOpacityInXdirection, scaleInOut } from '../animation';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import {saveToCollection, saveToFavourite} from '../api/index'
import useTemplate from '../hooks/useTemplate';
import { useNavigate } from 'react-router-dom';

function TemplateDesign({ data, index }) {
  const{ data: user, refetch:userRefetch} = useUser();
  const {refetch:templateRefetch} = useTemplate();
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user,data);
    userRefetch();
  }
  const addToFavourite = async (e) => {
    e.stopPropagation();
    await saveToFavourite(user,data);
    templateRefetch();
  }
  const [isHovered,setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleRouteNavigation = ()=>{
    navigate(`/resumeDetail/${data?._id}`, {replace:true})
  }
  return (
    <motion.div
      key={data?._id}
      {...scaleInOut(index)}>
      <div className='w-full h-[450px]  2xl:h-[500px] bg-gray-200 rounded-md relative overflow-hidden'
      onMouseEnter={()=> setIsHovered(true)}
      onMouseLeave={()=> setIsHovered(false)}>
        <img src={data.imageUrl} alt="" className='w-full h-full object-cover' />
        <AnimatePresence>
          {isHovered && (
            <motion.div
            {...fadeInOutWithOpacity}
            onClick={handleRouteNavigation}
            className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer'
          >
            <div className='flex flex-col items-end justify-start w-full gap-8'>
              <InnerBoxCard 
              label={user?.collections?.includes(data._id)? "Added to collection":"Add to collection"} 
              Icon={user?.collections?.includes(data._id)? BiSolidFolderPlus : BiFolderPlus} 
              onHandle={addToCollection} 
              />
              <InnerBoxCard 
              label={data?.favourites?.includes(user?.uid)? "Added to favourite":"Add to favourite"} 
              Icon={data?.favourites?.includes(user?.uid)? BiSolidHeart:BiHeart} 
              onHandle={addToFavourite} 
              />
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [hover,setHover] = useState(false);
  return(
    <div onClick={onHandle} className='w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center hover:shadow-md relative'
    onMouseEnter={()=> setHover(true)}
    onMouseLeave={()=> setHover(false)}>
      <Icon className="text-base text-txtPrimary"/>
      <AnimatePresence>
        {hover && (
          <motion.div 
          className='px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45'
          {...popInOutWithOpacityInXdirection}>
            <p className='text-sm text-txtPrimary whitespace-nowrap'>{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TemplateDesign
