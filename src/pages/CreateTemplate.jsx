import React, { useEffect, useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../config/firebase.config';
import { adminIds, initialTags } from '../utils/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplate from '../hooks/useTemplate';
import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

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
  const [selectedTag, setSelectedTag] = useState([]);
  const { data: templates, isLoading: templatesIsLoading, isError: templatesIsError, refetch: templatesRefetch } = useTemplate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }))
  }
  const handleFileSelect = async (e) => {
    setImageData((prevData) => ({ ...prevData, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed',
        (snapshot) => {
          setImageData((prevData) => ({ ...prevData, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }))
        },
        (err) => {
          if (err.message.includes('storage/unauthorized')) {
            toast.error(`Error: Authorization Revoked`)
          } else {
            toast.error(`Error: ${err.message}`)
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageData((prevData) => ({ ...prevData, url: downloadUrl }))
          });
          toast.success("Image Uploaded");
          setInterval(() => {
            setImageData((prevData) => ({ ...prevData, isImageLoading: false }));
          }, 2000);
        })
    } else {
      toast.info("Invalid File Type");
    }
  }
  const deleteAnImageObject = async () => {
    setImageData((prevData) => ({ ...prevData, isImageLoading: true }))
    const deleteRef = ref(storage, imageData.url);
    deleteObject(deleteRef).then(() => {
      toast.success("Image Removed");
      setInterval(() => {
        setImageData((prevData) => ({ ...prevData, isImageLoading: false, url: null, progress: 0 }));
      }, 2000);
    })
  }
  const isAllowed = (file) => {
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    return allowedType.includes(file.type);
  }

  const handleSelectedTag = (tag) => {
    //check if the tag is selected or not
    if (selectedTag.includes(tag)) {
      //if tag selected then add add tag to the setSelectedTag expect that tag
      setSelectedTag(selectedTag.filter((selected) => selected !== tag));
    } else {
      //if tag not selected then add all the tag that is currently present in the selectedTag and add that tag into them.
      setSelectedTag([...selectedTag, tag]);
    }
  }
  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      tittle: formData.tittle,
      imageUrl: imageData.url,
      tags: selectedTag,
      name: templates && templates.length > 0 ? `templates${templates.length + 1}` : "template1",
      timestamp: timeStamp
    };
    await setDoc(doc(db, "templates", id), _doc).then(() => {
      setFormData((prevData) => ({ ...prevData, tittle: "", imageUrl: "" }));
      setImageData((prevData) => ({ ...prevData, isImageLoading: false, url: "", progress: 0 }));
      setSelectedTag([]);
      templatesRefetch();
      toast.success("Data store to the cloud");
    }).catch((error) => {
      console.log(error);
      toast.error("Something went wrong!");
    })

  }
  //remove template from firestore cloud
  const removeTemplate = async(template)=>{
    const deleteRef = ref(storage,template?.imageUrl);
    await deleteObject(deleteRef).then(async()=>{
      await deleteDoc(doc(db,"templates", template?._id)).then(()=>{
        toast.success("Template delete from cloud storage");
        templatesRefetch();
      }).catch((err)=>{
        toast.error(err.message);
      })
    })
  }
  //Check the user that they have admin prevelage or not 
  const {data:user,isLoading} = useUser();
  useEffect(()=>{
    if(!isLoading && !adminIds.includes(user?.uid)){
      Navigate('/',{replace:true});
    }
  },[user,isLoading])

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
          <p className='text-sm text-txtDark font-bold'>{templates && templates.length > 0 ? `templates${templates.length + 1}` : "template1"}</p>
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
                    <FaTrash className='text-sm text-white' />
                  </div>
                </div>
              </>)}
            </React.Fragment>)}
          </div>
        </div>
        <div className='w-full flex flex-wrap items-center gap-2'>
          {initialTags.map((tag, index) => (
            <div key={index} className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTag.includes(tag) ? "bg-blue-500 text-white" : ""}`} onClick={() => handleSelectedTag(tag)}>
              <p className='text-xs'>{tag}</p>
            </div>
          ))}
        </div>
        {/* action button */}
        <div className='w-full'>
          <button type='button' className='w-full bg-blue-700 text-white rounded-md py-3' onClick={pushToCloud}> Save</button>
        </div>
      </div>
      {/* right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4'>
        {templatesIsLoading ? (
          <>
            <div className='w-full h-full flex items-center justify-center'>
              <PuffLoader color='#498FCD' size={40} />
            </div>
          </>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <>
              <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4'>
                {templates?.map((template)=>(
                  <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden relative cursor-pointer'>
                    <img src={template?.imageUrl} alt="" className='w-full h-full object-cover' />
                    <div className='w-8 h-8 rounded-md absolute top-4 right-4 flex items-center justify-center cursor-pointer bg-red-500' onClick={()=>removeTemplate(template)}>
                    <FaTrash className='text-sm text-white' />
                  </div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              <>
                <div className='w-full h-full flex items-center justify-center flex-col'>
                  <PuffLoader color='#498FCD' size={40} />
                  <p className='text-xl tracking-wider capitalize text-txtPrimary'>No Data</p>
                </div>
              </>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default CreateTemplate