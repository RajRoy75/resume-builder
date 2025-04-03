// import React, { useState }from 'react'
// import useUser from '../hooks/useUser'
// import useTemplate from '../hooks/useTemplate'
// import TemplateDesign from '../components/TemplateDesign'
// import { AnimatePresence } from 'framer-motion';
// import NoData from '../assets/img/nodata.gif'
// import { useQuery } from "react-query"
// import { getSavedResumes } from "../api/index.js"
// import MainSpinner from "../components/MainSpinner"
//
//
// function UserProfile() {
//   const {data:user} = useUser();
//   const {
//     data: templates,
//     isLoading: templateIsLoading,
//     isError: templateIsError,
//     refetch: templateRefetch } = useTemplate();
//   const [activeTab, setActiveTab] = useState('collections')
//   const {data: savedResumes,
//     isLoading: savedResumesLoading} = useQuery(
//     ["savedResumes", user?.uid], 
//     ()=> getSavedResumes(user?.uid),
//     { enabled: !!user?.uid });
//   if(templateIsLoading){
//     return <MainSpinner/>
//   }
//
//   return (
//     <div className="w-full flex flex-col items-center justify-start py-12">
//       <div className="w-full h-72 bg-blue-100">
//         <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="w-full h-full object-cover"/>
//         <div className="flex items-center justify-center flex-col gap-4">
//           {user?.photoURL ? (
//             <React.Fragment>
//               <img src={user?.photoURL}
//                 alt=""
//                 className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
//                 referrerPolicy='no-referrer'
//                 loading ="lazy"
//               />
//             </React.Fragment>
//           ):(
//               <React.Fragment>
//                 <img src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?t=st=1740635843~exp=1740639443~hmac=57d9602ea3f3e0c149f1cb40ff3c914f4559b4c8003720288140dd2f362a3d1f&w=740"
//                   alt=""
//                   className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
//                   referrerPolicy='no-referrer'
//                   loading ="lazy"
//                 />
//               </React.Fragment>
//             )}
//           <p className="text-2xl text-txtDark">{user?.displayName}</p>
//
//         </div>
//         {/* tab */}
//         <div className="flex items-center justify-center mt-12">
//           <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick = {()=> setActiveTab("collections")}>
//             <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === "collections" && "bg-white shadow-md text-blue-600"} `}>Collections</p>
//           </div>
//           <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick = {()=> setActiveTab("resumes")}>
//             <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === "resumes" && "bg-white shadow-md text-blue-600"} `}>My Resumes</p>
//           </div>
//
//         </div>
//         {/* tabcontent */}
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6 ">
//           <AnimatePresence>
//             {activeTab === 'collections' && (
//               <React.Fragment>
//                 {user?.collections.length > 0 && user?.collections ? (
//                   <RenderATemplate templates={templates?.filter((temp)=> user?.collections?.includes(temp?._id)
//                   )}/>
//                 ):(
//                     <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
//                       <img src={NoData} alt="" className="w-32 h-auto object-contain"/>
//                       <p>No Data</p>
//                     </div>
//                   )}
//               </React.Fragment>
//             )}
//             {activeTab === 'resumes' && (
//               <React.Fragment>
//                 {savedResumesLoading ? (
//                   <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
//                     <p>Loading...</p>
//                   </div>
//                 ) : (
//                     savedResumes && savedResumes.length > 0 ? (
//                       <RenderATemplate templates={savedResumes}/>
//                     ) : (
//                         <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
//                           <img src={NoData} alt="" className="w-32 h-auto object-contain"/>
//                           <p>No Data</p>
//                         </div>
//                       )
//                   )}
//               </React.Fragment>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   )
// }
//
// const RenderATemplate = ({templates})=>{
//   return (
//     <React.Fragment>
//       {templates && templates?.length > 0 && (
//         <React.Fragment>
//           <AnimatePresence>
//             {templates && templates.map((template,index)=>(
//               <TemplateDesign key={template?._id} data={template} index={index}/>
//             ))}
//           </AnimatePresence>
//         </React.Fragment>
//       )}
//     </React.Fragment>
//   )
// }
// export default UserProfile

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from "react-query";

import useUser from '../hooks/useUser';
import useTemplate from '../hooks/useTemplate';
import TemplateDesign from '../components/TemplateDesign';
import MainSpinner from "../components/MainSpinner";
import NoData from '../assets/img/nodata.gif';
import { getSavedResumes } from "../api/index.js";

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 50 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const headerVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const templateVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.03,
    transition: { 
      duration: 0.2 
    }
  }
};

function UserProfile() {
  const { data: user } = useUser();
  const {
    data: templates,
    isLoading: templateIsLoading,
  } = useTemplate();
  
  const [activeTab, setActiveTab] = useState('collections');
  
  const { 
    data: savedResumes,
    isLoading: savedResumesLoading 
  } = useQuery(
    ["savedResumes", user?.uid], 
    () => getSavedResumes(user?.uid),
    { enabled: !!user?.uid }
  );

  if (templateIsLoading) {
    return <MainSpinner />;
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="max-w-7xl mx-auto px-4 lg:px-8 py-12"
    >
      {/* Profile Header */}
      <motion.div 
        variants={headerVariants}
        className="relative mb-12"
      >
        {/* Background Image */}
        <div className="h-64 overflow-hidden rounded-2xl shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="mb-4"
          >
            <img 
              src={user?.photoURL || "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?t=st=1740635843~exp=1740639443~hmac=57d9602ea3f3e0c149f1cb40ff3c914f4559b4c8003720288140dd2f362a3d1f&w=740"}
              alt="Profile"
              referrerPolicy='no-referrer'
              className='w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover'
            />
          </motion.div>
          <h1 className="text-3xl font-semibold text-white drop-shadow-md">
            {user?.displayName}
          </h1>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        variants={headerVariants}
        className="flex justify-center space-x-4 mb-8"
      >
        {['collections', 'resumes'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${
              activeTab === tab 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            {tab === 'collections' ? 'Collections' : 'My Resumes'}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={templateVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {activeTab === 'collections' && (
            <ContentRenderer 
              data={templates?.filter((temp) => user?.collections?.includes(temp?._id))}
              emptyMessage="No Collections"
            />
          )}
          
          {activeTab === 'resumes' && (
            <ContentRenderer 
              data={savedResumes}
              isLoading={savedResumesLoading}
              emptyMessage="No Saved Resumes"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const ContentRenderer = ({ data, isLoading, emptyMessage }) => {
  if (isLoading) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-12"
      >
        <img 
          src={NoData} 
          alt="No Data" 
          className="w-48 h-auto mb-4 opacity-70" 
        />
        <p className="text-gray-500">{emptyMessage}</p>
      </motion.div>
    );
  }

  return data.map((template, index) => (
    <motion.div
      key={template?._id}
      variants={templateVariants}
      whileHover="hover"
    >
      <TemplateDesign 
        data={template} 
        index={index}
      />
    </motion.div>
  ));
};

export default UserProfile;
