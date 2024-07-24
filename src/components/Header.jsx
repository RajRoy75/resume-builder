import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import { Logo } from '../assets';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import { HiLogout } from 'react-icons/hi';
import { fadeInOutWithOpacity, slideUpAndDown } from '../animation';
import { useQueryClient } from 'react-query';
import { auth } from '../config/firebase.config';
import { adminIds } from '../utils/helpers';
import { toast } from 'react-toastify';

function Header() {
    const { data, isLoading, isError } = useUser();
    const [menu, setMenu] = useState(false);

    const queryClient = useQueryClient();
    const signOutUser = async () => {
        await auth.signOut().then(() => {
            queryClient.setQueryData('user', null);
            toast("LogOut Succesfully");
        })
    }
    return (
        <header className='w-full flex justify-between items-center px-4 py-3 lg:px-8 border-b border-gray-300  bg-bgPrimary z-50 gap-12 sticky top-0'>
            <Link to={'/'}>
                <img src={Logo} alt="error" className='w-12 h-auto object-contain' />
            </Link>
            <div className='flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200'>
                <input type="text" placeholder='Search here...' className='flex-1 h-10 bg-transparent text-base font-semibold border-none focus:outline-none' />
            </div>
            <AnimatePresence>
                {isLoading ? (
                    <PuffLoader color='#498fcd' size={40} />
                ) : (
                    <React.Fragment>
                        {data ? (
                            <motion.div className='relative' onClick={() => setMenu(!menu)}>
                                {data?.photoURL ? (
                                    <div className='w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer shadow-md'>
                                        <img src={data?.photoURL}
                                            alt=""
                                            className='w-full h-full object-cover rounded-md'
                                            referrerPolicy='no-referrer' />
                                    </div>
                                ) : (
                                    <div className='w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer bg-blue-700 shadow-md'>
                                        <p className='text-lg text-white'>{data?.email[0].toUpperCase()}</p>
                                    </div>
                                )}
                                <AnimatePresence>
                                    {menu && (
                                        <motion.div className='absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12'
                                            onMouseLeave={() => setMenu(!menu)}
                                            {...slideUpAndDown}
                                        >
                                            {data?.photoURL ? (
                                                <div className='w-18 h-18 rounded-full relative flex items-center justify-center cursor-pointer shadow-md'>
                                                    <img src={data?.photoURL}
                                                        alt=""
                                                        className='w-full h-full object-cover rounded-full'
                                                        referrerPolicy='no-referrer' />
                                                </div>
                                            ) : (
                                                <div className='w-12 h-12 rounded-full relative flex items-center justify-center cursor-pointer bg-blue-700 shadow-md'>
                                                    <p className='text-3xl text-white'>{data?.email[0].toUpperCase()}</p>
                                                </div>
                                            )}
                                            {data?.displayName && (
                                                <p className='text-txtDark cursor-pointer'>{data?.displayName}</p>
                                            )}
                                            {/* menues */}
                                            <div className='w-full flex flex-col items-start gap-6 pt-6'>
                                                <Link to={'/profile'} className='text-txtLight hover:text-txtDark text-base whitespace-nowrap'>My Account</Link>
                                                {adminIds.includes(data?.uid) &&(
                                                    <Link to={'/template/create'} className='text-txtLight hover:text-txtDark text-base whitespace-nowrap'>Add new template</Link>
                                                )}
                                                
                                                <div className='w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer' onClick={signOutUser}>
                                                    <p className='group-hover:text-txtDark text-txtLight'>Sign Out</p>
                                                    <HiLogout className='group-hover:text-txtDark text-txtLight' />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <Link to={'/auth'}>
                                <motion.button {...fadeInOutWithOpacity} className='px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150' type='button'>
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>


        </header>
    )
}

export default Header