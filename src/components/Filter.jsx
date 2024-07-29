import React, { useState } from 'react'
import { MdLayersClear } from 'react-icons/md';
import { AnimatePresence,motion } from 'framer-motion';
import { popInOutWithOpacity } from '../animation';
import { FiltersData } from '../utils/helpers';
import useFilter from '../hooks/useFilter';
import { useQueryClient } from 'react-query';

function Filter() {
    const [isHover,setIsHover] = useState(false);
    const {data:filterData, isLoading, isError, refetch} = useFilter();
    const queryClient = useQueryClient();
    const handleFilterValue = (value)=>{
        // const previousState = queryClient.getQueryData('globalFilter') || {};
        // const updateState = {...previousState, searchTerm:value};
        // queryClient.setQueryData('globalFilter',updateState);
        queryClient.setQueryData("globalFilter",{...queryClient.getQueryData("globalFilter"), searchTerm:value});
    }
    const clearFilter = ()=>{
        queryClient.setQueryData('globalFilter',{...queryClient.getQueryData('globalFilter'), searchTerm: ""});
    }
  return (
    <div className='w-full flex items-center justify-start py-4'>
        <div className='cursor-pointer border border-gray-300 rounmd px-3 py-2 group hover:shadow-md bg-gray-200 relative rounded-md mr-2'
         onMouseEnter={()=> setIsHover(true)} 
         onMouseLeave={()=> setIsHover(false)}
         onClick={clearFilter}>
            
            <MdLayersClear className='text-xl' />
            <AnimatePresence>
                {isHover && (
                    <motion.div className='absolute -top-8 -left-2 bg-white rounded-md shadow-md px-2 py-1' {...popInOutWithOpacity}>
                        <p className='whitespace-nowrap text-xs'>Clear all</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        <div className='w-full flex items-center justify-start overflow-x-scroll scrollbar-none gap-6'>
            {FiltersData && FiltersData.map((item)=>(
                <div 
                onClick={()=> handleFilterValue(item.value)}
                key={item.id} 
                className={`border border-gray-300 px-6 py-2 rounded-md cursor-pointer group hover:shadow-md ${filterData.searchTerm === item.value && "bg-gray-300 shadow-md"}`}>
                <p className='text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap'>{item.label}</p>
            </div>
            )
                
            )}
        </div>
    </div>
  )
}

export default Filter