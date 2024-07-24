import React, { useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase.config';

function CreateTemplate() {
  const [formData, setFormData] = useState({
    tittle: '',
    imageUrl: null,
  });
  const [imageData, setImageData] = useState({
    isImageLoading: false,
    url: null,
    progress: 0
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }))
  }
  const handleFileSelect = async(e)=>{
    setImageData((prevData)=>({...prevData,isImageLoading:true}));
    const file = e.target.files[0];
    if(file && isAllowed(file)){
      const storageRef = ref(storage,`Template/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef,file)
      uploadTask.on('state_changed',
        (snapshot)=>{
          setImageData((prevData)=>({...prevData,progress:(snapshot.bytesTransferred / snapshot.totalBytes) * 100}))
        },
      (err)=>{
        if(err.message.includes('storage/unauthorized')){
          toast.error(`Error: Authorization Revoked`)
        }else{
          toast.error(`Error: ${err.message}`)
        }
      },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
        setImageData((prevData)=>({...prevData,url:downloadUrl}))
      });
      toast.success("Image Uploaded");
      setInterval(() => {
        setImageData((prevData)=>({...prevData,isImageLoading:false}));
      }, 2000);
    })
    }else{
      toast.info("Invalid File Type");
    }
    console.log(file);
  }
  const deleteAnImageObject = async()=>{
    setImageData((prevData)=>({...prevData,isImageLoading:true}))
    const deleteRef = ref(storage,imageData.url);
    deleteObject(deleteRef).then(()=>{
      toast.success("Image Removed");
      setInterval(() => {
        setImageData((prevData)=>({...prevData,isImageLoading:false,url:null,progress:0}));
      }, 2000);
    })
  }
  const isAllowed = (file)=>{
    const allowedType = ["image/jpeg","image/jpg","image/png"];
    return allowedType.includes(file.type);
  }
  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
      {/* left container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1 gap-4 px-2 flex-col items-start justify-center'>
        <div className='w-full '>
          <p className='text-lg text-txtPrimary'>Create a new Template</p>
        </div>
        {/* template Id */}
        <div className='w-full flex items-center justify-end'>
          <p className='text-base text-txtLight uppercase font-semibold'>TEMP ID: {''}</p>
          <p className='text-sm text-txtDark font-bold'>template1</p>
        </div>
        {/* template title  */}
        <div className='w-full'>
          <input
            className='w-full px-4 py-3 border border-gray-300 rounded-md bg-transparent text-lg text-txtPrimary focus:text-txtDark
              focus:shadow-md outline-none'
            type="text"
            name='tittle'
            placeholder='Template Tittle'
            value={formData.tittle}
            onChange={handleInputChange} />
          {/* file upload section */}
          <div className='w-full bg-gray-100 backdrop-blur-md h-[420px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex justify-center items-center mt-4'>
            {imageData.isImageLoading ? (
              <React.Fragment>
                <div className='flex justify-center items-center flex-col'>
                  <PuffLoader color='#498FCD' size={40} />
                  <p>{imageData?.progress.toFixed(2)} %</p>
                </div>
              </React.Fragment>
            ) : (<React.Fragment>
              {!imageData?.url ? (<>
                <label className='w-full h-full cursor-pointer'>
                  <div className='flex flex-col items-center justify-center h-full w-full'>
                    <div className='flex flex-col items-center gap-4 justify-center cursor-pointer'>
                      <FaUpload className='text-2xl' />
                      <p className='text-lg text-txtLight'>Click to Upload</p>
                    </div>
                  </div>
                  <input type="file" className='w-0 h-0' accept='.jpeg, .jpg, .png' onChange={handleFileSelect} />
                </label>
              </>) : (<>
                <div className='relative w-full h-full overflow-hidden rounded-md'>
                  <img src={imageData?.url} className='w-full h-full object-cover' loading='lazy' alt='error' />
                  <div className='w-8 h-8 rounded-md absolute top-4 right-4 flex items-center justify-center cursor-pointer bg-red-500' onClick={deleteAnImageObject}>
                    <FaTrash className='text-sm text-white'/>
                  </div>
                </div>
              </>)}
            </React.Fragment>)}
          </div>
        </div>
      </div>
      {/* right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9 bg-red-400'>right side</div>
    </div>
  )
}

export default CreateTemplate