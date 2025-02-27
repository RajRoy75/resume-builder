import React, { useState, useEffect }from 'react'
import useUser from '../hooks/useUser'
import useTemplate from '../hooks/useTemplate'
import TemplateDesign from '../components/TemplateDesign'
import { AnimatePresence } from 'framer-motion';
import NoData from '../assets/img/nodata.gif'
import { useQuery } from "react-query"
import { getSavedResumes } from "../api/index.js"
import MainSpinner from "../components/MainSpinner"


function UserProfile() {
  const {data:user} = useUser();
  const {
    data: templates,
    isLoading: templateIsLoading,
    isError: templateIsError,
    refetch: templateRefetch } = useTemplate();
  const [activeTab, setActiveTab] = useState('collections')
  const {data: savedResumes,
    isLoading: savedResumesLoading} = useQuery(
    ["savedResumes", user?.uid], 
    ()=> getSavedResumes(user?.uid),
    { enabled: !!user?.uid });
  if(templateIsLoading){
    return <MainSpinner/>
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-100">
        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="w-full h-full object-cover"/>
        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <React.Fragment>
              <img src={user?.photoURL}
                alt=""
                className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
                referrerPolicy='no-referrer'
                loading ="lazy"
              />
            </React.Fragment>
          ):(
              <React.Fragment>
                <img src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?t=st=1740635843~exp=1740639443~hmac=57d9602ea3f3e0c149f1cb40ff3c914f4559b4c8003720288140dd2f362a3d1f&w=740"
                  alt=""
                  className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
                  referrerPolicy='no-referrer'
                  loading ="lazy"
                />
              </React.Fragment>
            )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>

        </div>
        {/* tab */}
        <div className="flex items-center justify-center mt-12">
          <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick = {()=> setActiveTab("collections")}>
            <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === "collections" && "bg-white shadow-md text-blue-600"} `}>Collections</p>
          </div>
          <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick = {()=> setActiveTab("resumes")}>
            <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === "resumes" && "bg-white shadow-md text-blue-600"} `}>My Resumes</p>
          </div>

        </div>
        {/* tabcontent */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6 ">
          <AnimatePresence>
            {activeTab === 'collections' && (
              <React.Fragment>
                {user?.collections.length > 0 && user?.collections ? (
                  <RenderATemplate templates={templates?.filter((temp)=> user?.collections?.includes(temp?._id)
                  )}/>
                ):(
                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                      <img src={NoData} alt="" className="w-32 h-auto object-contain"/>
                      <p>No Data</p>
                    </div>
                  )}
              </React.Fragment>
            )}
            {activeTab === 'resumes' && (
              <React.Fragment>
                {savedResumesLoading ? (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <p>Loading...</p>
                  </div>
                ) : (
                    savedResumes && savedResumes.length > 0 ? (
                      <RenderATemplate templates={savedResumes}/>
                    ) : (
                        <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                          <img src={NoData} alt="" className="w-32 h-auto object-contain"/>
                          <p>No Data</p>
                        </div>
                      )
                  )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const RenderATemplate = ({templates})=>{
  return (
    <React.Fragment>
      {templates && templates?.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates && templates.map((template,index)=>(
              <TemplateDesign key={template?._id} data={template} index={index}/>
            ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
export default UserProfile
