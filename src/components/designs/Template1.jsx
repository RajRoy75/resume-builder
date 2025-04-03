// import React, { useEffect, useRef, useState } from "react";
// import MainSpinner from "../MainSpinner";
// import { useQuery } from "react-query";
// import useUser from "../../hooks/useUser";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import { toast } from "react-toastify";
// import { db } from "../../config/firebase.config";
// import { getTemplateDetailEditByUser } from "../../api";
// import jsPDF from "jspdf";
// import * as htmlToImage from "html-to-image";
//
// import { TemplateOne } from "../../assets";
// import {
//   FaHouse,
//   FaTrash,
//   FaPenToSquare,
//   FaPencil,
//   FaPlus,
// } from "react-icons/fa6";
// import { BiSolidBookmarks } from "react-icons/bi";
// import {
//   BsFiletypePdf,
//   BsFiletypePng,
//   BsFiletypeJpg,
//   BsFiletypeSvg,
// } from "react-icons/bs";
//
// import { AnimatePresence, motion } from "framer-motion";
// import { fadeInOutWithOpacity, opacityINOut} from "../../animation/index.js";
//
// const Template1 = () => {
//   const { pathname } = useLocation();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const templateName = pathname?.split("/")?.slice(-1);
//   const searchParams = new URLSearchParams(location.search);
//   const loadedTemplateId = searchParams.get("templateId");
//   // console.log(pathname, templateName, loadedTemplateId);
//
//   const [isEdit, setIsEdit] = useState(false);
//   const { data: user } = useUser();
//
//   const resumeRef = useRef(null);
//
//   const [imageAsset, setImageAsset] = useState({
//     isImageLoading: false,
//     imageUrl: null,
//   });
//
//   const {
//     data: resumeData,
//     isLoading: resume_isLoading,
//     isError: resume_isError,
//     refetch: refetch_resumeData,
//   } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
//     getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
//   );
//
//   const [formData, setFormData] = useState({
//     fullname: "Karen Richards",
//     professionalTitle: "Professional Title",
//     personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
//     refererName: "Sara Taylore",
//     refererRole: "Director | Company Name",
//     mobile: "+91 0000-0000",
//     email: "urname@gmail.com",
//     website: "urwebsite.com",
//     address: "your street address, ss, street, city/zip code - 1234",
//   });
//
//   const [experiences, setExperiences] = useState([
//     {
//       year: "2012 - 2014",
//       title: "Job Position Here",
//       companyAndLocation: "Company Name / Location here",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
//     },
//     {
//       year: "2012 - 2014",
//       title: "Job Position Here",
//       companyAndLocation: "Company Name / Location here",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
//     },
//     {
//       year: "2012 - 2014",
//       title: "Job Position Here",
//       companyAndLocation: "Company Name / Location here",
//       description:
//         "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
//     },
//   ]);
//
//   const [skills, setSkills] = useState([
//     {
//       title: "skill1",
//       percentage: "75",
//     },
//     {
//       title: "skill2",
//       percentage: "75",
//     },
//     {
//       title: "skill3",
//       percentage: "75",
//     },
//     {
//       title: "skill4",
//       percentage: "75",
//     },
//     {
//       title: "skill5",
//       percentage: "75",
//     },
//   ]);
//
//   const [education, setEducation] = useState([
//     {
//       major: "ENTER YOUR MAJOR",
//       university: "Name of your university / college 2005-2009",
//     },
//   ]);
//
//   useEffect(() => {
//     if (resumeData?.formData) {
//       setFormData({ ...resumeData?.formData });
//     }
//     if (resumeData?.experiences) {
//       setExperiences(resumeData?.experiences);
//     }
//     if (resumeData?.skills) {
//       setSkills(resumeData?.skills);
//     }
//     if (resumeData?.education) {
//       setEducation(resumeData?.education);
//     }
//     if (resumeData?.userProfilePic) {
//       setImageAsset((prevAsset) => ({
//         ...prevAsset,
//         imageUrl: resumeData?.userProfilePic,
//       }));
//     }
//   }, [resumeData]);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//
//   const toggleEditable = () => {
//     setIsEdit(!isEdit);
//     var inputs = document.querySelectorAll("input");
//     var textarea = document.querySelectorAll("textarea");
//
//     for (var i = 0; i < inputs.length; i++) {
//       inputs[i].readOnly = !inputs[i].readOnly;
//     }
//
//     for (var i = 0; i < textarea.length; i++) {
//       textarea[i].readOnly = !textarea[i].readOnly;
//     }
//   };
//
//   // image upload to the cloud
//   const handleFileSelect = async (event) => {
//     console.log("clicked input")
//     setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
//     // console.log(event.target.files[0]);
//     const file = event.target.files[0];
//     if (file && isAllowed(file)) {
//       const reader = new FileReader();
//
//       reader.onload = function (event) {
//         const dataURL = event.target.result;
//         console.log("Data URL:", dataURL);
//
//         // You can now use the dataURL as needed, e.g., to display an image.
//         setImageAsset((prevAsset) => ({
//           ...prevAsset,
//           imageUrl: dataURL,
//         }));
//       };
//
//       // Read the file as a Data URL
//       reader.readAsDataURL(file);
//     } else {
//       toast.error("Invalid File Format");
//     }
//   };
//
//   const isAllowed = (file) => {
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//     return allowedTypes.includes(file.type);
//   };
//
//   // delete an image
//   const deleteImageObject = () => {
//     setImageAsset((prevAsset) => ({
//       ...prevAsset,
//       imageUrl: null,
//     }));
//   };
//
//   // uploader finshed
//
//   const handleExpChange = (index, e) => {
//     const { name, value } = e.target;
//     // Create a copy of the workExperiences array
//     const updatedExperiences = [...experiences];
//     // Update the specific field for the experience at the given index
//     updatedExperiences[index][name] = value;
//     // Update the state with the modified array
//     setExperiences(updatedExperiences);
//   };
//
//   const removeExperience = (index) => {
//     // Create a copy of the workExperiences array and remove the experience at the given index
//     const updatedExperiences = [...experiences];
//     updatedExperiences.splice(index, 1);
//     // Update the state with the modified array
//     setExperiences(updatedExperiences);
//   };
//
//   const addExperience = () => {
//     // Create a copy of the workExperiences array and add a new experience
//     const updatedExperiences = [
//       ...experiences,
//       {
//         year: "2012 - 2014",
//         title: "Job Position Here",
//         companyAndLocation: "Company Name / Location here",
//         description:
//           "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
//       },
//     ];
//     // Update the state with the modified array
//     setExperiences(updatedExperiences);
//   };
//
//   const handleSkillsChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedSkills = [...skills];
//     updatedSkills[index][name] = value;
//     setSkills(updatedSkills);
//   };
//
//   const removeSkill = (index) => {
//     const updatedSkills = [...skills];
//     updatedSkills.splice(index, 1);
//     setSkills(updatedSkills);
//   };
//
//   const addSkill = () => {
//     const updatedSkills = [
//       ...skills,
//       {
//         title: "skill1",
//         percentage: "75",
//       },
//     ];
//     setSkills(updatedSkills);
//   };
//
//   const handleEducationChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedEdu = [...education];
//     updatedEdu[index][name] = value;
//     setEducation(updatedEdu);
//   };
//
//   const removeEducation = (index) => {
//     const updatedEdu = [...education];
//     updatedEdu.splice(index, 1);
//     setEducation(updatedEdu);
//   };
//
//   const addEducation = () => {
//     const updatedEdu = [
//       ...education,
//       {
//         major: "ENTER YOUR MAJOR",
//         university: "Name of your university / college 2005-2009",
//       },
//     ];
//     setEducation(updatedEdu);
//   };
//
//   const saveFormData = async () => {
//     const timeStamp = serverTimestamp();
//     const resume_id = `${templateName}-${user?.uid}`;
//     const imageUrl = await getImage();
//     const _doc = {
//       _id: loadedTemplateId,
//       resume_id,
//       formData,
//       education,
//       experiences,
//       skills,
//       timeStamp,
//       userProfilePic: imageAsset.imageUrl,
//       imageUrl,
//     };
//     console.log(_doc);
//     setDoc(doc(db, "users", user?.uid, "resumes", resume_id), _doc)
//       .then(() => {
//         toast.success(`Data Saved`);
//         refetch_resumeData();
//       })
//       .catch((err) => {
//         toast.error(`Error : ${err.message}`);
//       });
//   };
//
//   const getImage = async () => {
//     const element = resumeRef.current;
//     if (!element) {
//       console.error("Unable to capture content. The DOM element is null.");
//       return;
//     }
//     try {
//       const dataUrl = await htmlToImage.toJpeg(element);
//       console.log(dataUrl);
//       return dataUrl;
//     } catch (error) {
//       console.error("Oops, something went wrong!", error.message);
//       return null; // Return a default value or handle the error appropriately
//     }
//   };
//
//   const generatePDF = async () => {
//     const element  = resumeRef.current;
//     if(!element){
//       toast.info("Unable to capture the content");
//       return;
//     }
//     htmlToImage.toPng(element).then((dataUrl)=>{
//       const a4Width = 210;
//       const a4Height = 297;
//
//       let pdf = new jsPDF({
//         orientation: "p",
//         unit: "mm",
//         format: [a4Width, a4Height],  
//       })
//
//       const aspectRatio = a4Width / a4Height;
//       const imagaeWidth = a4Width;
//       const imageHeight = a4Width / aspectRatio;
//
//       const verticalMargin = (a4Height - imageHeight) / 2;
//
//       pdf.addImage(dataUrl, "PNG", 0, verticalMargin, imagaeWidth, imageHeight);
//       pdf.save("resume.pdf");
//     }).catch((err)=>{
//       toast.error(`errror: ${err.message}`);
//     })
//   };
//
//   const generateImage = async () => {
//     const element  = resumeRef.current;
//     if(!element){
//       toast.info("Unable to capture the content");
//       return;
//     }
//     htmlToImage.toJpeg(element).then((dataUrl)=>{
//       const a = document.createElement("a");
//       a.href = dataUrl;
//       a.download = "resume.jpg";
//       a.click();
//     }).catch((err)=>{
//       toast.error(`errror: ${err.message}`);
//     })
//   };
//
//   const generatePng = async () => {
//     const element  = resumeRef.current;
//     if(!element){
//       toast.info("Unable to capture the content");
//       return;
//     }
//     htmlToImage.toPng(element).then((dataUrl)=>{
//       const a = document.createElement("a");
//       a.href = dataUrl;
//       a.download = "resume.png";
//       a.click();
//     }).catch((err)=>{
//       toast.error(`errror: ${err.message}`);
//     })
//   };
//
//   const generateSvg = async () => {
//     const element  = resumeRef.current;
//     if(!element){
//       toast.info("Unable to capture the content");
//       return;
//     }
//     htmlToImage.toSvg(element).then((dataUrl)=>{
//       const a = document.createElement("a");
//       a.href = dataUrl;
//       a.download = "resume.svg";
//       a.click();
//     }).catch((err)=>{
//       toast.error(`errror: ${err.message}`);
//     })
//   };
//
//   if (resume_isLoading) return <MainSpinner />;
//
//   if (resume_isError) {
//     return (
//       <div className="w-full h-[60vh] flex flex-col items-center justify-center">
//         <p className="text-lg text-txtPrimary font-semibold">
//           Error While fetching the data
//         </p>
//       </div>
//     );
//   }
//   return (
//     <div className="w-full flex flex-col items-center justify-start gap-4">
//       {/* bread crump */}
//       <div className="w-full flex items-center gap-2 px-4">
//         <Link
//           to={"/"}
//           className="flex items-center justify-center gap-2 text-txtPrimary"
//         >
//           <FaHouse />
//           Home
//         </Link>
//         <p
//           className="text-txtPrimary cursor-pointer"
//           onClick={() => navigate(-1)}
//         >
//           / Template1 /
//         </p>
//         <p>Edit</p>
//       </div>
//
//       <div className="w-full lg:w-[1200px] grid grid-cols-1 lg:grid-cols-12 px-6 lg:px-32">
//         {/* template design */}
//         <div className="col-span-12 px-4 py-6">
//           <div className="flex items-center justify-end w-full gap-12 mb-4">
//             <div
//               className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
//               onClick={toggleEditable}
//             >
//               {isEdit ? (
//                 <FaPenToSquare className="text-sm text-txtPrimary" />
//               ) : (
//                 <FaPencil className="text-sm text-txtPrimary" />
//               )}
//               <p className="text-sm text-txtPrimary">Edit</p>
//             </div>
//
//             <div
//               className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
//               onClick={saveFormData}
//             >
//               <BiSolidBookmarks className="text-sm text-txtPrimary" />
//               <p className="text-sm text-txtPrimary">Save</p>
//             </div>
//
//             <div className=" flex items-center justify-center gap-2">
//               <p className="text-sm text-txtPrimary">Download : </p>
//               <BsFiletypePdf
//                 className="text-2xl text-txtPrimary cursor-pointer"
//                 onClick={generatePDF}
//               />
//               <BsFiletypePng
//                 onClick={generatePng}
//                 className="text-2xl text-txtPrimary cursor-pointer"
//               />
//               <BsFiletypeJpg
//                 className="text-2xl text-txtPrimary cursor-pointer"
//                 onClick={generateImage}
//               />
//               <BsFiletypeSvg
//                 onClick={generateSvg}
//                 className="text-2xl text-txtPrimary cursor-pointer"
//               />
//             </div>
//           </div>
//           <div className="w-full h-auto grid grid-cols-12" ref={resumeRef}>
//             <div className="col-span-4 bg-black flex flex-col items-center justify-start">
//               <div className="w-full h-80 bg-gray-300 flex items-center justify-center">
//                 {!imageAsset.imageUrl ? (
//                   <React.Fragment>
//                     <label className="w-full cursor-pointer h-full">
//                       <div className="w-full flex flex-col items-center justify-center h-full">
//                         <div className="w-full flex flex-col justify-center items-center cursor-pointer">
//                           <img
//                             src={TemplateOne}
//                             className="w-full h-80 object-cover"
//                             alt=""
//                           />
//                         </div>
//                       </div>
//
//                       {isEdit && (
//                         <input
//                           type="file"
//                           className="w-0 h-0"
//                           accept=".jpeg,.jpg,.png"
//                           onChange={handleFileSelect}
//                         />
//                       )}
//                     </label>
//                   </React.Fragment>
//                 ) : (
//                   <div className="relative w-full h-full overflow-hidden rounded-md">
//                     <img
//                       src={imageAsset.imageUrl}
//                       alt="uploaded "
//                       className="w-full h-full object-cover"
//                       loading="lazy"
//                     />
//
//                     {isEdit && (
//                       <div
//                         className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
//                         onClick={deleteImageObject}
//                       >
//                         <FaTrash className="text-sm text-white" />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//
//               <div className="w-full flex flex-col items-center justify-start pl-8 mt-4 gap-6">
//                 <div className="w-full">
//                   <p className="uppercase text-lg font-semibold text-gray-100">
//                     Education
//                   </p>
//                   <div className="w-full h-[2px] bg-yellow-400 mt-2"></div>
//                   <AnimatePresence>
//                     {education &&
//                       education?.map((edu, i) => (
//                         <motion.div
//                           key={i}
//                           {...opacityINOut(i)}
//                           className="w-full pl-4 mt-3 relative"
//                         >
//                           <input
//                             type="text"
//                             readOnly="true"
//                             name="major"
//                             value={edu.major}
//                             onChange={(e) => handleEducationChange(i, e)}
//                             className={`bg-transparent outline-none border-none text-sm font-semibold uppercase  text-gray-100  ${
//                               isEdit && "text-yellow-400 w-full"
//                             }`}
//                           />
//
//                           <textarea
//                             readOnly="true"
//                             className={`text-xs text-gray-200 mt-2  w-full  outline-none border-none ${
//                               isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
//                             }`}
//                             name="university"
//                             value={edu.university}
//                             onChange={(e) => handleEducationChange(i, e)}
//                             rows="2"
//                             style={{
//                               maxHeight: "auto",
//                               minHeight: "40px",
//                               resize: "none",
//                             }}
//                           />
//                           <AnimatePresence>
//                             {isEdit && (
//                               <motion.div
//                                 {...fadeInOutWithOpacity}
//                                 onClick={() => removeEducation(i)}
//                                 className="cursor-pointer absolute right-2 top-0"
//                               >
//                                 <FaTrash className="text-sm text-gray-100" />
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </motion.div>
//                       ))}
//                   </AnimatePresence>
//                 </div>
//
//                 <AnimatePresence>
//                   {isEdit && (
//                     <motion.div
//                       {...fadeInOutWithOpacity}
//                       onClick={addEducation}
//                       className="cursor-pointer"
//                     >
//                       <FaPlus className="text-base text-gray-100" />
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//
//                 {/* reference */}
//                 <div className="w-full">
//                   <p className="uppercase text-lg font-semibold text-gray-100">
//                     Reference
//                   </p>
//                   <div className="w-full h-[2px] bg-yellow-400 mt-2"></div>
//                   <div className="w-full pl-4 mt-3">
//                     <input
//                       value={formData.refererName}
//                       onChange={handleChange}
//                       name="refererName"
//                       type="text"
//                       readOnly="true"
//                       className={`bg-transparent outline-none border-none text-base tracking-widest capitalize text-gray-100 w-full ${
//                         isEdit && "bg-[#1c1c1c]"
//                       }`}
//                     />
//
//                     <input
//                       value={formData.refererRole}
//                       onChange={handleChange}
//                       name="refererRole"
//                       type="text"
//                       readOnly="true"
//                       className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
//                         isEdit && "bg-[#1c1c1c]"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </div>
//
//               <div className="w-full flex flex-col items-start justify-start mt-6 gap-6">
//                 <div className="w-full grid grid-cols-12">
//                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
//                   <div className="col-span-9">
//                     <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
//                       <p className="text-sm font-semibold text-gray-200">
//                         Phone
//                       </p>
//                     </div>
//                     <input
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       name="mobile"
//                       type="text"
//                       readOnly="true"
//                       className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
//                         isEdit && "bg-[#1c1c1c]"
//                       }`}
//                     />
//                   </div>
//                 </div>
//
//                 {/* email */}
//                 <div className="w-full grid grid-cols-12">
//                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
//                   <div className="col-span-9">
//                     <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
//                       <p className="text-sm font-semibold text-gray-200">
//                         Email
//                       </p>
//                     </div>
//                     <input
//                       value={formData.email}
//                       onChange={handleChange}
//                       name="email"
//                       type="text"
//                       readOnly="true"
//                       className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
//                         isEdit && "bg-[#1c1c1c]"
//                       }`}
//                     />
//                   </div>
//                 </div>
//
//                 {/* website */}
//                 <div className="w-full grid grid-cols-12">
//                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
//                   <div className="col-span-9">
//                     <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
//                       <p className="text-sm font-semibold text-gray-200">
//                         Website
//                       </p>
//                     </div>
//
//                     <input
//                       value={formData.website}
//                       onChange={handleChange}
//                       name="website"
//                       type="text"
//                       readOnly="true"
//                       className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
//                         isEdit && "bg-[#1c1c1c]"
//                       }`}
//                     />
//                   </div>
//                 </div>
//
//                 {/* address */}
//                 <div className="w-full grid grid-cols-12">
//                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
//                   <div className="col-span-9">
//                     <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
//                       <p className="text-sm font-semibold text-gray-200">
//                         Address
//                       </p>
//                     </div>
//
//                     <textarea
//                       readOnly="true"
//                       className={`text-xs text-gray-200 mt-2 px-3  w-full  outline-none border-none ${
//                         isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
//                       }`}
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       rows="2"
//                       style={{
//                         maxHeight: "auto",
//                         minHeight: "40px",
//                         resize: "none",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-8 flex flex-col items-center justify-start py-6 bg-white">
//               <div className="w-full py-6"></div>
//               {/* title */}
//               <div className="w-full px-8 py-6 bg-yellow-500">
//                 <div className="flex items-center justify-start ">
//                   <input
//                     type="text"
//                     readOnly="true"
//                     name="fullname"
//                     value={formData.fullname}
//                     onChange={handleChange}
//                     className={`bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider text-txtDark font-extrabold ${
//                       isEdit && "text-white w-full"
//                     }`}
//                   />
//                 </div>
//
//                 <input
//                   value={formData.professionalTitle}
//                   onChange={handleChange}
//                   name="professionalTitle"
//                   type="text"
//                   readOnly="true"
//                   className={`bg-transparent outline-none border-none text-xl tracking-widest uppercase text-txtPrimary w-full ${
//                     isEdit && "text-white"
//                   }`}
//                 />
//               </div>
//
//               {/* about me */}
//               <div className="w-full px-8 py-6 flex flex-col items-start justify-start gap-6">
//                 <div className="w-full">
//                   <p className="uppercase text-xl tracking-wider">About Me</p>
//                   <div className="w-full h-1 bg-txtDark my-3"></div>
//                   <textarea
//                     readOnly="true"
//                     className={`text-base text-txtPrimary tracking-wider w-full  outline-none border-none ${
//                       isEdit ? "bg-gray-200" : "bg-transparent"
//                     }`}
//                     name="personalDescription"
//                     value={formData.personalDescription}
//                     onChange={handleChange}
//                     rows="4"
//                     style={{
//                       minHeight: "100px",
//                       width: "100%",
//                       height: "100px",
//                       resize: "none",
//                     }}
//                   />
//                 </div>
//
//                 {/* experience */}
//                 <div className="w-full">
//                   <p className="uppercase text-xl tracking-wider">
//                     Work Experience
//                   </p>
//                   <div className="w-full h-1 bg-txtDark my-3"></div>
//                   <div className="w-full flex flex-col items-center justify-start gap-4">
//                     <AnimatePresence>
//                       {experiences &&
//                         experiences?.map((exp, i) => (
//                           <motion.div
//                             {...opacityINOut(i)}
//                             className="w-full grid grid-cols-12"
//                             key={i}
//                           >
//                             <div className="col-span-4">
//                               <input
//                                 value={exp.year}
//                                 onChange={(e) => handleExpChange(i, e)}
//                                 name="year"
//                                 type="text"
//                                 readOnly="true"
//                                 className={` outline-none border-none text-base tracking-eide uppercase text-txtDark w-full ${
//                                   isEdit ? "bg-gray-200" : "bg-transparent"
//                                 }`}
//                               />
//                             </div>
//                             <div className="col-span-8 relative">
//                               <AnimatePresence>
//                                 {isEdit && (
//                                   <motion.div
//                                     {...fadeInOutWithOpacity}
//                                     onClick={() => removeExperience(i)}
//                                     className="cursor-pointer absolute right-0 top-2"
//                                   >
//                                     <FaTrash className="text-base text-txtPrimary" />
//                                   </motion.div>
//                                 )}
//                               </AnimatePresence>
//                               <input
//                                 value={exp.title}
//                                 onChange={(e) => handleExpChange(i, e)}
//                                 name="title"
//                                 type="text"
//                                 readOnly="true"
//                                 className={` outline-none border-none font-sans text-lg tracking-wide capitalize text-txtDark w-full ${
//                                   isEdit ? "bg-gray-200" : "bg-transparent"
//                                 }`}
//                               />
//
//                               <input
//                                 value={exp.companyAndLocation}
//                                 onChange={(e) => handleExpChange(i, e)}
//                                 name="companyAndLocation"
//                                 type="text"
//                                 readOnly="true"
//                                 className={` outline-none border-none text-sm tracking-wide capitalize text-txtPrimary w-full ${
//                                   isEdit ? "bg-gray-200" : "bg-transparent"
//                                 }`}
//                               />
//
//                               <textarea
//                                 readOnly="true"
//                                 className={`text-xs mt-4  text-txtPrimary tracking-wider w-full  outline-none border-none ${
//                                   isEdit ? "bg-gray-200" : "bg-transparent"
//                                 }`}
//                                 name="description"
//                                 value={exp.description}
//                                 onChange={(e) => handleExpChange(i, e)}
//                                 rows="3"
//                                 style={{
//                                   maxHeight: "auto",
//                                   minHeight: "60px",
//                                   resize: "none",
//                                 }}
//                               />
//                             </div>
//                           </motion.div>
//                         ))}
//                     </AnimatePresence>
//                     <AnimatePresence>
//                       {isEdit && (
//                         <motion.div
//                           {...fadeInOutWithOpacity}
//                           onClick={addExperience}
//                           className="cursor-pointer"
//                         >
//                           <FaPlus className="text-base text-txtPrimary" />
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//
//                 {/* skills */}
//                 <div className="w-full">
//                   <p className="uppercase text-xl tracking-wider">Skills</p>
//                   <div className="w-full h-1 bg-txtDark my-3"></div>
//                   <div className="w-full flex flex-wrap items-center justify-start gap-4">
//                     <AnimatePresence>
//                       {skills &&
//                         skills?.map((skill, i) => (
//                           <motion.div
//                             key={i}
//                             {...opacityINOut(i)}
//                             className="flex-1"
//                             style={{ minWidth: 225 }}
//                           >
//                             <div className="w-full flex items-center justify-between">
//                               <div className="flex items-center justify-center">
//                                 <input
//                                   value={skill.title}
//                                   onChange={(e) => handleSkillsChange(i, e)}
//                                   name="title"
//                                   type="text"
//                                   readOnly="true"
//                                   className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
//                                     isEdit ? "bg-gray-200" : "bg-transparent"
//                                   }`}
//                                 />
//
//                                 <AnimatePresence>
//                                   {isEdit && (
//                                     <motion.input
//                                       {...fadeInOutWithOpacity}
//                                       value={skill.percentage}
//                                       onChange={(e) => handleSkillsChange(i, e)}
//                                       name="percentage"
//                                       type="text"
//                                       className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
//                                         isEdit
//                                           ? "bg-gray-200"
//                                           : "bg-transparent"
//                                       }`}
//                                     />
//                                   )}
//                                 </AnimatePresence>
//                               </div>
//
//                               <AnimatePresence>
//                                 {isEdit && (
//                                   <motion.div
//                                     {...fadeInOutWithOpacity}
//                                     onClick={() => removeSkill(i)}
//                                     className="cursor-pointer "
//                                   >
//                                     <FaTrash className="text-base text-txtPrimary" />
//                                   </motion.div>
//                                 )}
//                               </AnimatePresence>
//                             </div>
//                             <div className="relative mt-2 w-full h-1 rounded-md bg-gray-400">
//                               <div
//                                 className="h-full rounded-md bg-gray-600"
//                                 style={{
//                                   width: `${skill.percentage}%`,
//                                   transition: "width 0.3s ease",
//                                 }}
//                               ></div>
//                             </div>
//                           </motion.div>
//                         ))}
//                     </AnimatePresence>
//                   </div>
//                   <AnimatePresence>
//                     {isEdit && (
//                       <div className="w-full  flex items-center justify-center py-4">
//                         <motion.div
//                           {...fadeInOutWithOpacity}
//                           onClick={addSkill}
//                           className="cursor-pointer"
//                         >
//                           <FaPlus className="text-base text-txtPrimary" />
//                         </motion.div>
//                       </div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Template1;



import React, { useState, useRef, useEffect } from 'react';
import {
  FaPencilAlt, FaTrash, FaPlus, FaUser, FaBriefcase, FaGraduationCap,
  FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCog, FaAddressBook,
  FaUpload, FaSpinner
} from 'react-icons/fa';
import { FaPenToSquare, FaHouse } from "react-icons/fa6";
import { BiSolidBookmarks } from 'react-icons/bi';
import { BsFiletypePdf, BsFiletypePng, BsFiletypeJpg, BsFiletypeSvg } from 'react-icons/bs';
// --- Routing and Data Fetching Hooks ---
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import useUser from "../../hooks/useUser"; // Assuming this hook exists
import { getTemplateDetailEditByUser } from "../../api"; // Assuming this API function exists
// --- Image/PDF Generation ---
import * as htmlToImage from "html-to-image";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase.config"; // Assuming Firebase is configured
import jsPDF from "jspdf";
// --- Assets and Animations ---
import { TemplateOne } from "../../assets"; // Original asset import
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutWithOpacity, opacityINOut} from "../../animation/index.js";
import MainSpinner from '../MainSpinner'; // Original spinner import

// Define EditableField helper component (Consistent with other templates)
const EditableField = ({ as = 'input', name, value, onChange, isEdit, placeholder, className = '', inputClassName = '', readOnly = !isEdit, ...props }) => {
    const commonProps = {
      readOnly: readOnly,
      name: name,
      value: value,
      onChange: onChange,
      placeholder: isEdit ? placeholder : '',
      // Base styles: remove w-full, apply via className prop
      className: `outline-none border-none bg-transparent ${isEdit ? ' px-1 py-0.5 rounded border border-gray-300' : ''} ${inputClassName}`,
      ...props
    };

    const element = as === 'textarea'
      ? <textarea {...commonProps} style={{ resize: isEdit ? 'vertical' : 'none', minHeight: 'auto', ...props.style }}/>
      : <input type={props.type || "text"} {...commonProps} />;

    // Apply the main className to the element itself for layout control etc.
    const finalClassName = `${commonProps.className} ${className}`;
    return React.cloneElement(element, { className: finalClassName });
};


const Template1 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1)[0] || "template1"; // Use extracted name or default
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();
  const resumeRef = useRef(null);

  // --- State ---
  const [imageAsset, setImageAsset] = useState({ isImageLoading: false, imageUrl: null });
  const [formData, setFormData] = useState({
    fullname: "Karen Richards",
    professionalTitle: "Professional Title",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore", // Single reference fields kept in formData
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
  });
  const [experiences, setExperiences] = useState([
    { year: "2012 - 2014", title: "Job Position Here", companyAndLocation: "Company Name / Location here", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt." },
    { year: "2012 - 2014", title: "Job Position Here", companyAndLocation: "Company Name / Location here", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt." },
    { year: "2012 - 2014", title: "Job Position Here", companyAndLocation: "Company Name / Location here", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt." },
  ]);
  const [skills, setSkills] = useState([
    { title: "skill1", percentage: "75" }, { title: "skill2", percentage: "75" }, { title: "skill3", percentage: "75" }, { title: "skill4", percentage: "75" }, { title: "skill5", percentage: "75" },
  ]);
  const [education, setEducation] = useState([
    { major: "ENTER YOUR MAJOR", university: "Name of your university / college 2005-2009" },
  ]);

  // --- Data Fetching ---
   const {
     data: resumeData,
     isLoading: resume_isLoading,
     isError: resume_isError, // Keep isError for handling
     refetch: refetch_resumeData,
   } = useQuery(
     ["templateEditedByUser", `${templateName}-${user?.uid}`],
     () => getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`),
     { enabled: !!user }
   );

   // --- Load Data Effect ---
   useEffect(() => {
     if (resumeData) {
       setFormData(resumeData.formData || formData);
       setEducation(resumeData.education || education);
       setExperiences(resumeData.experiences || experiences);
       setSkills(resumeData.skills || skills);
       // No separate referees state here, handled in formData
       // No interests state here
       if (resumeData.userProfilePic) {
         setImageAsset((prev) => ({ ...prev, imageUrl: resumeData.userProfilePic }));
       }
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [resumeData]);

  // --- Handlers ---
  const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const toggleEditable = () => setIsEdit(!isEdit); // Simplified - No direct DOM manipulation needed

  // Image Handlers
  const handleFileSelect = async (event) => {
    if (!isEdit) return;
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) { toast.error("JPG or PNG only"); return; }
    setImageAsset({ isImageLoading: true, imageUrl: null });
    const reader = new FileReader();
    reader.onload = (e) => setImageAsset({ isImageLoading: false, imageUrl: e.target.result });
    reader.onerror = () => { toast.error("Error reading file"); setImageAsset({ isImageLoading: false, imageUrl: null }); };
    reader.readAsDataURL(file);
  };
  const deleteImageObject = () => { if (isEdit) setImageAsset({ isImageLoading: false, imageUrl: null }); };

  // Education Handlers
  const handleEducationChange = (index, e) => { const { name, value } = e.target; const updated = [...education]; updated[index][name] = value; setEducation(updated); };
  const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
  const addEducation = () => setEducation([...education, { major: "NEW MAJOR", university: "University / Year - Year" }]);

  // Experience Handlers
  const handleExpChange = (index, e) => { const { name, value } = e.target; const updated = [...experiences]; updated[index][name] = value; setExperiences(updated); };
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { year: "Year - Year", title: "New Position", companyAndLocation: "Company / Location", description: "Description." }]);

  // Skills Handlers
  const handleSkillsChange = (index, e) => { const { name, value } = e.target; const updated = [...skills]; if(name === 'percentage'){updated[index][name] = Math.max(0, Math.min(100, Number(value) || 0))} else {updated[index][name] = value}; setSkills(updated); };
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));
  const addSkill = () => setSkills([...skills, { title: "New Skill", percentage: "50" }]);

  // --- Saving and Exporting ---
  const saveFormData = async () => {
    if (!user) { toast.error("Login required to save."); return; }
    const toastId = toast.loading("Saving...");
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user.uid}`;
    const imageUrl = await getImage();
    const profilePicToSave = imageAsset.imageUrl?.startsWith('data:image/') ? imageAsset.imageUrl : null;

    const _doc = {
      _id: loadedTemplateId, resume_id, timeStamp, imageUrl, userProfilePic: profilePicToSave,
      formData, // Includes reference fields
      education, experiences, skills, // Array states
    };

    console.log("Saving doc:", _doc); // Debug: check saved data structure
    setDoc(doc(db, "users", user.uid, "resumes", resume_id), _doc)
      .then(() => { toast.update(toastId, { render: "Saved!", type: "success", isLoading: false, autoClose: 2000 }); if (refetch_resumeData) refetch_resumeData(); })
      .catch((err) => { toast.update(toastId, { render: `Save Error: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("Save Error:", err); });
  };

   const getImage = async () => { /* ... same as Template5 ... */
     const element = resumeRef.current; if (!element) { toast.error("Resume element not found."); return null; } try { return await htmlToImage.toJpeg(element, { quality: 0.90, pixelRatio: 1.5 }); } catch (error) { toast.error("Failed capture preview."); console.error("Capture Error:", error); return null; }
   };

   const generatePDF = async () => { /* ... same as Template5 ... */
     const element = resumeRef.current; if (!element) { toast.error("Cannot capture content."); return; } const toastId = toast.loading("Generating PDF..."); try {
       const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 2 });
       const pdf = new jsPDF('p', 'mm', 'a4'); const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = pdf.internal.pageSize.getHeight(); const img = new Image(); img.src = dataUrl;
       img.onload = () => {
         const aspectRatio = img.width / img.height; let imgW = pdfWidth; let imgH = imgW / aspectRatio; if (imgH > pdfHeight) { imgH = pdfHeight; imgW = imgH * aspectRatio; } const x = (pdfWidth - imgW) / 2; const y = (pdfHeight - imgH) / 2; // Center vertically
         pdf.addImage(dataUrl, 'PNG', x, y, imgW, imgH); pdf.save(`${formData.fullname}_Resume.pdf`); toast.update(toastId, { render: "PDF Generated!", type: "success", isLoading: false, autoClose: 3000 });
       }; img.onerror = () => toast.update(toastId, { render: "Image load failed.", type: "error", isLoading: false, autoClose: 3000 });
     } catch (error) { toast.update(toastId, { render: `PDF Error: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("PDF Error:", error); }
   };

   const generateImage = async (format = "jpeg") => { /* ... same as Template5 ... */
     const element = resumeRef.current; if (!element) { toast.error("Cannot capture content."); return; } const toastId = toast.loading(`Generating ${format.toUpperCase()}...`); try {
       let dataUrl, filename = `${formData.fullname}_Resume.${format}`; const options = { pixelRatio: 2 };
       switch (format) { case "png": dataUrl = await htmlToImage.toPng(element, options); break; case "svg": dataUrl = await htmlToImage.toSvg(element); break; default: options.quality = 0.95; dataUrl = await htmlToImage.toJpeg(element, options); filename = `${formData.fullname}_Resume.jpg`; break; }
       const a = document.createElement("a"); a.href = dataUrl; a.download = filename; a.click(); toast.update(toastId, { render: `${format.toUpperCase()} Downloaded!`, type: "success", isLoading: false, autoClose: 2000 });
     } catch (error) { toast.update(toastId, { render: `Image Error: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("Image Error:", error); }
   };
   const generatePng = () => generateImage('png');
   const generateJpg = () => generateImage('jpeg');
   const generateSvg = () => generateImage('svg');

  // --- Loading/Error States ---
  if (resume_isLoading) return <MainSpinner />;
  if (resume_isError) {
    return ( <div className="w-full h-[60vh] flex flex-col items-center justify-center"> <p className="text-lg text-txtPrimary font-semibold"> Error While fetching the data </p> </div> );
  }

  // --- RENDER ---
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 font-sans">
      {/* Breadcrumb and Controls (kept from original Template1 structure) */}
      <div className="w-full flex items-center gap-2 px-4">
        <Link to={"/"} className="flex items-center justify-center gap-2 text-txtPrimary"> <FaHouse /> Home </Link>
        <p className="text-txtPrimary cursor-pointer" onClick={() => navigate(-1)}> / {templateName} / </p>
        <p>Edit</p>
      </div>

      {/* Added Container to center the controls and resume */}
      <div className="w-full lg:w-[1200px] flex flex-col items-center justify-start px-4 md:px-8 lg:px-16">
        {/* Top Controls */}
        <div className="w-full flex items-center justify-end gap-4 md:gap-8 lg:gap-12 mb-4">
          <div className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer shadow-sm" onClick={toggleEditable}>
            {isEdit ? <FaPenToSquare className="text-sm text-txtPrimary" /> : <FaPencilAlt className="text-sm text-txtPrimary" />} {/* Using FaPencilAlt for consistency */}
            <p className="text-sm text-txtPrimary">Edit</p>
          </div>
          <button className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-sm disabled:opacity-50" onClick={saveFormData} disabled={!user}>
            <BiSolidBookmarks className="text-sm" />
            <p className="text-sm">Save</p>
          </button>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-txtPrimary hidden md:block">Download:</p>
            <BsFiletypePdf className="text-xl text-red-500 hover:text-red-700 cursor-pointer" onClick={generatePDF} title="Download PDF"/>
            <BsFiletypePng onClick={generatePng} className="text-xl text-green-500 hover:text-green-700 cursor-pointer" title="Download PNG"/>
            <BsFiletypeJpg onClick={generateJpg} className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer" title="Download JPG"/>
            <BsFiletypeSvg onClick={generateSvg} className="text-xl text-purple-500 hover:text-purple-700 cursor-pointer" title="Download SVG"/>
          </div>
        </div>

        {/* Resume Template Body */}
        <div className="w-full h-auto grid grid-cols-12 bg-white shadow-lg" ref={resumeRef}> {/* A4 aspect ratio maintained by content */}
          {/* === Left Column (Dark) === */}
          <div className="col-span-4 bg-black flex flex-col items-center justify-start pt-6"> {/* Added padding top */}
             {/* Profile Image */}
             <div className="w-full h-60 md:h-72 bg-gray-300 flex items-center justify-center group"> {/* Adjusted height */}
               <label htmlFor="profile-pic-upload-t1" className={`w-full h-full block cursor-${isEdit ? 'pointer' : 'default'}`}>
                 {imageAsset.isImageLoading ? ( <div className="w-full h-full flex items-center justify-center bg-gray-700"><FaSpinner className="animate-spin text-3xl text-white" /></div> )
                  : imageAsset.imageUrl ? ( <img src={imageAsset.imageUrl} alt="Profile" className="w-full h-full object-cover" /> )
                  : ( <img src={TemplateOne} className="w-full h-full object-cover opacity-60" alt="Placeholder"/> )}
               </label>
                {isEdit && <input type="file" id="profile-pic-upload-t1" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileSelect} />}
                {isEdit && imageAsset.imageUrl && !imageAsset.isImageLoading && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={deleteImageObject} title="Remove Image">
                    <FaTrash className="text-sm text-white" />
                  </div>
                )}
              </div>

              {/* Education & Reference Container */}
              <div className="w-full flex flex-col items-center justify-start px-4 md:px-6 lg:px-8 mt-4 gap-6 text-gray-100">
                {/* Education */}
                <div className="w-full">
                  <p className="uppercase text-base md:text-lg font-semibold">Education</p>
                  <div className="w-full h-[2px] bg-yellow-400 mt-2 mb-3"></div>
                  <AnimatePresence>
                    {education.map((edu, i) => (
                      <motion.div key={i} {...opacityINOut(i)} className="w-full pl-2 md:pl-4 mb-3 relative group">
                        <EditableField
                          name="major" value={edu.major} onChange={(e) => handleEducationChange(i, e)} isEdit={isEdit}
                          placeholder="Major / Degree"
                          className={`text-sm font-semibold uppercase w-full mb-1 ${isEdit ? "text-yellow-400 !bg-gray-800" : ""}`}
                        />
                        <EditableField
                          as="textarea" name="university" value={edu.university} onChange={(e) => handleEducationChange(i, e)} isEdit={isEdit}
                          placeholder="University / Dates" rows={2}
                          className={`text-xs text-gray-300 mt-1 w-full leading-snug ${isEdit ? "!bg-gray-800" : ""}`}
                          style={{ minHeight: "30px", resize: "none" }}
                        />
                        {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeEducation(i)} className="cursor-pointer absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100" title="Remove Education"> <FaTrash className="text-xs" /> </motion.div>)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={addEducation} className="cursor-pointer self-center mt-1 text-gray-400 hover:text-yellow-500"> <FaPlus className="text-sm" /> </motion.div>)}
                </div>

                {/* Reference */}
                <div className="w-full">
                  <p className="uppercase text-base md:text-lg font-semibold">Reference</p>
                  <div className="w-full h-[2px] bg-yellow-400 mt-2 mb-3"></div>
                  <div className="w-full pl-2 md:pl-4">
                    <EditableField
                      name="refererName" value={formData.refererName} onChange={handleChange} isEdit={isEdit}
                      placeholder="Reference Name"
                      className={`text-base tracking-widest capitalize w-full mb-1 ${isEdit ? "!bg-gray-800" : ""}`}
                    />
                    <EditableField
                      name="refererRole" value={formData.refererRole} onChange={handleChange} isEdit={isEdit}
                      placeholder="Reference Title, Company"
                      className={`text-xs capitalize text-gray-300 w-full ${isEdit ? "!bg-gray-800" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info with Bars */}
              <div className="w-full flex flex-col items-start justify-start mt-6 gap-4 md:gap-6 pb-6"> {/* Added bottom padding */}
                 {/* Phone */}
                 <div className="w-full grid grid-cols-12 items-center">
                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                   <div className="col-span-9 h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center text-sm font-semibold text-gray-200"> Phone </div>
                   <div className="col-span-3"></div> {/* Empty cell for alignment */}
                   <div className="col-span-9 px-3 pt-1">
                     <EditableField name="mobile" value={formData.mobile} onChange={handleChange} isEdit={isEdit} placeholder="+XX XXXX XXXX" className={`text-xs text-gray-200 w-full ${isEdit ? "!bg-gray-800" : ""}`} />
                   </div>
                 </div>
                 {/* Email */}
                 <div className="w-full grid grid-cols-12 items-center">
                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                   <div className="col-span-9 h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center text-sm font-semibold text-gray-200"> Email </div>
                   <div className="col-span-3"></div>
                   <div className="col-span-9 px-3 pt-1">
                     <EditableField name="email" value={formData.email} onChange={handleChange} isEdit={isEdit} placeholder="your.email@example.com" className={`text-xs text-gray-200 w-full ${isEdit ? "!bg-gray-800" : ""}`} />
                   </div>
                 </div>
                 {/* Website */}
                 <div className="w-full grid grid-cols-12 items-center">
                   <div className="col-span-3 w-full h-6 bg-yellow-400"></div>
                   <div className="col-span-9 h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center text-sm font-semibold text-gray-200"> Website </div>
                   <div className="col-span-3"></div>
                   <div className="col-span-9 px-3 pt-1">
                     <EditableField name="website" value={formData.website} onChange={handleChange} isEdit={isEdit} placeholder="yourwebsite.com" className={`text-xs text-gray-200 w-full ${isEdit ? "!bg-gray-800" : ""}`} />
                   </div>
                 </div>
                 {/* Address */}
                 <div className="w-full grid grid-cols-12 items-start"> {/* items-start for textarea */}
                   <div className="col-span-3 w-full h-6 bg-yellow-400 mt-1"></div> {/* Align bar with text */}
                   <div className="col-span-9 h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center text-sm font-semibold text-gray-200"> Address </div>
                   <div className="col-span-3"></div>
                   <div className="col-span-9 px-3 pt-1">
                     <EditableField as="textarea" name="address" value={formData.address} onChange={handleChange} isEdit={isEdit} placeholder="Street, City, Zip Code" rows="2" className={`text-xs text-gray-200 w-full leading-snug ${isEdit ? "!bg-gray-800" : ""}`} style={{ minHeight: "40px", resize: "none" }} />
                   </div>
                 </div>
              </div>
          </div>

          {/* === Right Column (White) === */}
          <div className="col-span-8 flex flex-col items-center justify-start py-6 bg-white text-txtDark">
             {/* Spacer div to push content down from the top, adjust height as needed */}
             {/* <div className="w-full py-6"></div> */}

             {/* Name & Title Header Section */}
             <div className="w-full px-8 py-6 bg-yellow-500 mb-6"> {/* Added mb-6 */}
               <EditableField
                 name="fullname" value={formData.fullname} onChange={handleChange} isEdit={isEdit}
                 placeholder="YOUR FULL NAME"
                 className={`text-3xl font-sans uppercase tracking-wider font-extrabold w-full mb-1 ${isEdit ? "text-white !bg-yellow-600" : "text-txtDark"}`}
               />
               <EditableField
                 name="professionalTitle" value={formData.professionalTitle} onChange={handleChange} isEdit={isEdit}
                 placeholder="PROFESSIONAL TITLE"
                 className={`text-xl tracking-widest uppercase w-full ${isEdit ? "text-white !bg-yellow-600" : "text-txtPrimary"}`} // Changed text color
               />
             </div>

             {/* Sections Container */}
             <div className="w-full px-8 flex flex-col items-start justify-start gap-6">
               {/* About Me */}
               <div className="w-full">
                 <p className="uppercase text-xl tracking-wider">About Me</p>
                 <div className="w-full h-1 bg-txtDark my-3"></div>
                 <EditableField
                   as="textarea" name="personalDescription" value={formData.personalDescription} onChange={handleChange} isEdit={isEdit}
                   placeholder="Brief professional summary..." rows="4"
                   className={`text-base text-txtPrimary tracking-wider w-full leading-relaxed ${isEdit ? "!bg-gray-100" : ""}`}
                   style={{ minHeight: "100px", resize: "none" }}
                 />
               </div>

               {/* Work Experience */}
               <div className="w-full">
                 <p className="uppercase text-xl tracking-wider">Work Experience</p>
                 <div className="w-full h-1 bg-txtDark my-3"></div>
                 <div className="w-full flex flex-col items-center justify-start gap-4">
                   <AnimatePresence>
                     {experiences.map((exp, i) => (
                       <motion.div {...opacityINOut(i)} className="w-full grid grid-cols-12 gap-x-4" key={i}>
                         <div className="col-span-4">
                            {/* Year */}
                           <EditableField name="year" value={exp.year} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Year - Year" className={`text-base tracking-wide uppercase text-txtDark w-full ${isEdit ? "!bg-gray-100" : ""}`}/>
                         </div>
                         <div className="col-span-8 relative group">
                           {/* Title */}
                           <EditableField name="title" value={exp.title} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Job Position / Title" className={`font-sans text-lg tracking-wide capitalize text-txtDark w-full mb-1 ${isEdit ? "!bg-gray-100" : ""}`} />
                           {/* Company & Location */}
                           <EditableField name="companyAndLocation" value={exp.companyAndLocation} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Company / Location" className={`text-sm tracking-wide capitalize text-txtPrimary w-full mb-2 ${isEdit ? "!bg-gray-100" : ""}`} />
                           {/* Description */}
                           <EditableField as="textarea" name="description" value={exp.description} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Key responsibilities..." rows="3" className={`text-xs mt-1 text-txtPrimary tracking-wider w-full leading-snug ${isEdit ? "!bg-gray-100" : ""}`} style={{ minHeight: "60px", resize: "none" }}/>
                           {/* Delete Button */}
                           {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeExperience(i)} className="cursor-pointer absolute right-0 top-2 text-red-500 opacity-0 group-hover:opacity-100" title="Remove Experience"> <FaTrash className="text-sm" /> </motion.div>)}
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                   {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={addExperience} className="cursor-pointer text-txtPrimary hover:text-yellow-600 self-center mt-2"> <FaPlus className="text-base" /> </motion.div>)}
                 </div>
               </div>

               {/* Skills */}
               <div className="w-full">
                 <p className="uppercase text-xl tracking-wider">Skills</p>
                 <div className="w-full h-1 bg-txtDark my-3"></div>
                 <div className="w-full flex flex-wrap items-start justify-start gap-4">
                   <AnimatePresence>
                     {skills.map((skill, i) => (
                       <motion.div key={i} {...opacityINOut(i)} className="flex-1 relative group" style={{ minWidth: 'calc(50% - 1rem)' }}> {/* Ensure minimum width for 2 columns */}
                         <div className="w-full flex items-center justify-between mb-1">
                           {/* Skill Title */}
                           <EditableField name="title" value={skill.title} onChange={(e) => handleSkillsChange(i, e)} isEdit={isEdit} placeholder="Skill Name" className={`text-base tracking-wide capitalize font-semibold text-txtPrimary w-3/4 ${isEdit ? "!bg-gray-100" : ""}`} />
                           {/* Percentage Input/Display */}
                           <div className='flex items-center justify-end w-1/4'>
                             <EditableField
                                type="number" name="percentage" value={skill.percentage} onChange={(e) => handleSkillsChange(i, e)} isEdit={isEdit}
                                min="0" max="100" placeholder="%"
                                className={`text-base tracking-wide font-semibold text-txtPrimary w-10 text-right ${isEdit ? "!bg-gray-100" : ""}`}
                             />
                             <span className='text-base font-semibold text-txtPrimary'>%</span>
                           </div>
                           {/* Delete Button */}
                           {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeSkill(i)} className="cursor-pointer absolute -right-4 top-0 text-red-500 opacity-0 group-hover:opacity-100" title="Remove Skill"> <FaTrash className="text-sm" /> </motion.div>)}
                         </div>
                         {/* Progress Bar */}
                         <div className="relative w-full h-1 rounded-md bg-gray-300 overflow-hidden"> {/* Adjusted colors */}
                           <div className="h-full rounded-md bg-gray-600" style={{ width: `${skill.percentage}%`, transition: "width 0.3s ease" }}></div>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
                 {isEdit && (
                   <div className="w-full flex items-center justify-center py-4">
                     <motion.div {...fadeInOutWithOpacity} onClick={addSkill} className="cursor-pointer text-txtPrimary hover:text-yellow-600">
                       <FaPlus className="text-base" />
                     </motion.div>
                   </div>
                 )}
               </div>
             </div> {/* End Sections Container */}
          </div>
        </div>
      </div> {/* End Resume Body Container */}
    </div> // End Main Container
  );
};

export default Template1;
