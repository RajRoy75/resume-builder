// import React, { useState } from 'react';
// import useUser from '../hooks/useUser';
// import { Logo } from '../assets';
// import { Link } from 'react-router-dom';
// import { AnimatePresence, motion } from 'framer-motion';
// import { PuffLoader } from 'react-spinners';
// import { HiLogout } from 'react-icons/hi';
// import { fadeInOutWithOpacity, slideUpAndDown } from '../animation';
// import { useQueryClient } from 'react-query';
// import { auth } from '../config/firebase.config';
// import { adminIds } from '../utils/helpers';
// import { toast } from 'react-toastify';
// import useFilter from '../hooks/useFilter';
// import { IoClose } from 'react-icons/io5';
//
// function Header() {
//     const { data, isLoading, isError } = useUser();
//     const {data:filterData} = useFilter();
//     const [menu, setMenu] = useState(false);
//
//     const queryClient = useQueryClient();
//     const signOutUser = async () => {
//         await auth.signOut().then(() => {
//             queryClient.setQueryData('user', null);
//             toast("LogOut Succesfully");
//         })
//     }
//     const handleSearchTerm = (e)=>{
//         queryClient.setQueryData('globalFilter',{...queryClient.getQueryData('globalFilter'), searchTerm: e.target.value});
//     }
//     const clearFilter = ()=>{
//         queryClient.setQueryData('globalFilter',{...queryClient.getQueryData('globalFilter'), searchTerm: ""});
//     }
//     return (
//         <header className='w-full flex justify-between items-center px-4 py-3 lg:px-8 border-b border-gray-300  bg-bgPrimary z-50 gap-12 sticky top-0'>
//             <Link to={'/'}>
//                 <img src={Logo} alt="error" className='w-12 h-auto object-contain' />
//             </Link>
//             <div className='flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200'>
//                 <input 
//                 value={filterData?.searchTerm ? filterData.searchTerm : ""}
//                 onChange={handleSearchTerm}
//                 type="text" 
//                 placeholder='Search here...' 
//                 className='flex-1 h-10 bg-transparent text-base font-semibold border-none focus:outline-none' />
//                 <AnimatePresence>
//                     {filterData?.searchTerm.length > 0 && (
//                         <motion.div className='w-8 h-8 flex justify-center items-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150' {...fadeInOutWithOpacity} onClick={clearFilter}>
//                             <IoClose color='black' size={20}/>
//                     </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//             <AnimatePresence>
//                 {isLoading ? (
//                     <PuffLoader color='#498fcd' size={40} />
//                 ) : (
//                     <React.Fragment>
//                         {data ? (
//                             <motion.div className='relative' onClick={() => setMenu(!menu)}>
//                                 {data?.photoURL ? (
//                                     <div className='w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer shadow-md'>
//                                         <img src={data?.photoURL}
//                                             alt=""
//                                             className='w-full h-full object-cover rounded-md'
//                                             referrerPolicy='no-referrer' />
//                                     </div>
//                                 ) : (
//                                     <div className='w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer bg-blue-700 shadow-md'>
//                                         <p className='text-lg text-white'>{data?.email[0].toUpperCase()}</p>
//                                     </div>
//                                 )}
//                                 <AnimatePresence>
//                                     {menu && (
//                                         <motion.div className='absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12'
//                                             onMouseLeave={() => setMenu(!menu)}
//                                             {...slideUpAndDown}
//                                         >
//                                             {data?.photoURL ? (
//                                                 <div className='w-18 h-18 rounded-full relative flex items-center justify-center cursor-pointer shadow-md'>
//                                                     <img src={data?.photoURL}
//                                                         alt=""
//                                                         className='w-full h-full object-cover rounded-full'
//                                                         referrerPolicy='no-referrer' />
//                                                 </div>
//                                             ) : (
//                                                 <div className='w-12 h-12 rounded-full relative flex items-center justify-center cursor-pointer bg-blue-700 shadow-md'>
//                                                     <p className='text-3xl text-white'>{data?.email[0].toUpperCase()}</p>
//                                                 </div>
//                                             )}
//                                             {data?.displayName && (
//                                                 <p className='text-txtDark cursor-pointer'>{data?.displayName}</p>
//                                             )}
//                                             {/* menues */}
//                                             <div className='w-full flex flex-col items-start gap-6 pt-6'>
//                                                 <Link to={`/profile/${data?.uid}`} className='text-txtLight hover:text-txtDark text-base whitespace-nowrap'>My Account</Link>
//                                                 {adminIds.includes(data?.uid) &&(
//                                                     <Link to={'/template/create'} className='text-txtLight hover:text-txtDark text-base whitespace-nowrap'>Add new template</Link>
//                                                 )}
//
//                                                 <div className='w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer' onClick={signOutUser}>
//                                                     <p className='group-hover:text-txtDark text-txtLight'>Sign Out</p>
//                                                     <HiLogout className='group-hover:text-txtDark text-txtLight' />
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </motion.div>
//                         ) : (
//                             <Link to={'/auth'}>
//                                 <motion.button {...fadeInOutWithOpacity} className='px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150' type='button'>
//                                     Login
//                                 </motion.button>
//                             </Link>
//                         )}
//                     </React.Fragment>
//                 )}
//             </AnimatePresence>
//
//
//         </header>
//     )
// }
//
// export default Header


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { HiLogout } from 'react-icons/hi';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import useUser from '../hooks/useUser';
import useFilter from '../hooks/useFilter';
import { Logo } from '../assets';
import { auth } from '../config/firebase.config';
import { adminIds } from '../utils/helpers';

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const menuVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: -20,
    transition: { 
      duration: 0.2
    }
  }
};

function Header() {
  const { data, isLoading } = useUser();
  const { data: filterData } = useFilter();
  const [menu, setMenu] = useState(false);

  const queryClient = useQueryClient();

  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData('user', null);
      toast.success("Logged out successfully");
    });
  };

  const handleSearchTerm = (e) => {
    queryClient.setQueryData('globalFilter', {
      ...queryClient.getQueryData('globalFilter'), 
      searchTerm: e.target.value
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData('globalFilter', {
      ...queryClient.getQueryData('globalFilter'), 
      searchTerm: ""
    });
  };

  return (
    <motion.header 
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className='w-full bg-white shadow-subtle border-b border-gray-100 sticky top-0 z-50'
    >
      <div className='max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to={'/'} className='flex items-center'>
          <img 
            src={Logo} 
            alt="Logo" 
            className='w-10 h-10 object-contain transition-transform hover:scale-105' 
          />
        </Link>

        {/* Search Bar */}
        <div className='flex-1 mx-6 relative'>
          <div className='max-w-xl mx-auto relative'>
            <input 
              value={filterData?.searchTerm || ""}
              onChange={handleSearchTerm}
              type="text" 
              placeholder='Search templates...' 
              className='w-full pl-10 pr-12 py-2.5 rounded-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300'
            />
            <IoSearch 
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' 
              size={20} 
            />
            <AnimatePresence>
              {filterData?.searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={clearFilter}
                  className='absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors'
                >
                  <IoClose size={18} className='text-gray-600' />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Section */}
        <div className='flex items-center'>
          {isLoading ? (
            <PuffLoader color='#498fcd' size={40} />
          ) : (
            <UserProfile 
              data={data} 
              menu={menu} 
              setMenu={setMenu} 
              signOutUser={signOutUser} 
            />
          )}
        </div>
      </div>
    </motion.header>
  );
}

const UserProfile = ({ data, menu, setMenu, signOutUser }) => {
  if (!data) {
    return (
      <Link to={'/auth'}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'
        >
          Login
        </motion.button>
      </Link>
    );
  }

  return (
    <div className='relative'>
      <motion.div 
        onClick={() => setMenu(!menu)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='cursor-pointer'
      >
        {data?.photoURL ? (
          <img 
            src={data?.photoURL}
            alt="Profile" 
            referrerPolicy='no-referrer'
            className='w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow-sm' 
          />
        ) : (
          <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white'>
            {data?.email[0].toUpperCase()}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {menu && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className='absolute right-0 top-14 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4'
            onMouseLeave={() => setMenu(false)}
          >
            <div className='flex flex-col items-center'>
              {data?.photoURL ? (
                <img 
                  src={data?.photoURL}
                  alt="Profile" 
                  referrerPolicy='no-referrer'
                  className='w-16 h-16 rounded-full object-cover border-3 border-blue-100 shadow-md mb-3' 
                />
              ) : (
                <div className='w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl mb-3'>
                  {data?.email[0].toUpperCase()}
                </div>
              )}

              {data?.displayName && (
                <p className='text-lg font-semibold text-gray-800 mb-4'>
                  {data.displayName}
                </p>
              )}

              <div className='w-full space-y-2'>
                <Link 
                  to={`/profile/${data?.uid}`} 
                  className='block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors'
                >
                  My Account
                </Link>

                {adminIds.includes(data?.uid) && (
                  <Link 
                    to={'/template/create'} 
                    className='block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors'
                  >
                    Add New Template
                  </Link>
                )}

                <div 
                  onClick={signOutUser}
                  className='flex items-center justify-between px-3 py-2 rounded-md hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition-colors border-t mt-2'
                >
                  <span>Sign Out</span>
                  <HiLogout />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
