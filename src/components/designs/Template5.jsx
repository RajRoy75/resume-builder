import React, { useState, useRef, useEffect } from 'react';
import {
  FaPencilAlt, FaTrash, FaPlus, FaUser, FaBriefcase, FaGraduationCap,
  FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCog, FaAddressBook,
  FaUpload, FaSpinner
} from 'react-icons/fa';
import { FaPenToSquare } from "react-icons/fa6";
import { BiSolidBookmarks } from 'react-icons/bi';
import { BsFiletypePdf, BsFiletypePng, BsFiletypeJpg, BsFiletypeSvg } from 'react-icons/bs';
import { MdContactPage, MdCastForEducation } from "react-icons/md";
import { GoCrossReference } from "react-icons/go";
// Assuming you might use routing later, keep these imports commented if not used now
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query"; // Keep if using react-query
import useUser from "../../hooks/useUser"; // Keep if using this custom hook
import { getTemplateDetailEditByUser } from "../../api"; // Keep if using this API function
import * as htmlToImage from "html-to-image";
import { doc, serverTimestamp, setDoc } from "firebase/firestore"; // Keep for Firebase save
import { toast } from "react-toastify"; // Keep for notifications
import { db } from "../../config/firebase.config"; // Keep for Firebase config
import jsPDF from "jspdf";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutWithOpacity, opacityINOut } from "../../animation/index.js"; // Keep if using these animations
import { TemplateTwo } from "../../assets"; // Using TemplateTwo as a placeholder

// Template5 component based on the provided design
const Template5 = () => {
  // If not using react-router, comment out or remove these lines
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser(); // Keep if using user context/hook

  const resumeRef = useRef(null);

  // State for profile image
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageUrl: null, // Start with no image
  });

  // --- STATE DEFINITIONS ---
  const [formData, setFormData] = useState({
    fullname: "BRIAN R. BAXTER", // Split for styling later if needed
    title: "GRAPHIC & WEB DESIGNER",
    phone1: "+1-718-390-6588",
    phone2: "+1-313-981-8587",
    website: "www.yourwebsite.com",
    email: "yourinfo@email.com",
    addressLine1: "789 Prudence Street",
    addressLine2: "Lincoln Park, MI 48146",
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  });

  const [references, setReferences] = useState([
    {
      name: "DARWIN B. MAGANA",
      address: "2813 Shobe Lane Mancos, CO.",
      phone: "+1-970-533-3393",
      email: "Email: www.yourwebsite.com", // Label included here as per image
    },
    {
      name: "ROBERT J. BELVIN",
      address: "2129 Fairfax Drive Newark, NJ.",
      phone: "+1-908-987-5303",
      email: "Email: www.yourwebsite.com",
    },
  ]);

  const [education, setEducation] = useState([
    {
      university: "STANFORD UNIVERSITY",
      degree: "MASTER DEGREE GRADUATE",
      dates: "2011 - 2013",
    },
    {
      university: "UNIVERSITY OF CHICAGO",
      degree: "BACHELOR DEGREE GRADUATE",
      dates: "2007 - 2010",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      title: "SENIOR WEB DESIGNER",
      companyLocation: "Creative Agency / Chicago",
      dates: "2020 - Present",
      description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    },
    {
       title: "GRAPHIC DESIGNER",
       companyLocation: "Creative Market / Chicago",
       dates: "2015 - 2020",
       description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
     },
     {
       title: "MARKETING MANAGER",
       companyLocation: "Manufacturing Agency / NJ",
       dates: "2013 - 2015",
       description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
     }
  ]);

  const [skills, setSkills] = useState([
    { name: "Adobe Photoshop", level: 85 }, // Percentage for bar graph
    { name: "Adobe Illustrator", level: 75 },
    { name: "Microsoft Word", level: 90 },
    { name: "Microsoft Powerpoint", level: 80 },
    { name: "HTML-5 / CSS-3", level: 95 },
    // Add more skills if needed to fill the second column, or adjust layout logic
  ]);

  // --- Data Fetching (Keep if using react-query and Firebase) ---
   const {
     data: resumeData,
     isLoading: resume_isLoading,
     // isError: resume_isError, // Keep isError if you handle it
     refetch: refetch_resumeData,
   } = useQuery(
     ["templateEditedByUser", `${templateName}-${user?.uid}`],
     () => getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`),
     {
       enabled: !!user, // Only run query if user data is available
     }
   );

   // --- Effect to Load Data ---
   useEffect(() => {
     if (resumeData) {
       console.log("Loading data from Firestore:", resumeData);
       setFormData(resumeData.formData || formData);
       setExperiences(resumeData.experiences || experiences);
       setSkills(resumeData.skills || skills);
       setEducation(resumeData.education || education);
       setReferences(resumeData.references || references);
       if (resumeData.userProfilePic) {
         setImageAsset((prevAsset) => ({
           ...prevAsset,
           imageUrl: resumeData.userProfilePic,
         }));
       }
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [resumeData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEditable = () => setIsEdit(!isEdit);

  // Image Handlers (Copied and adapted from original Template2)
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !isEdit) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("File type not allowed (JPG, PNG only)");
      return;
    }

    setImageAsset((prev) => ({ ...prev, isImageLoading: true, imageUrl: null })); // Clear previous while loading

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      setImageAsset({ isImageLoading: false, imageUrl: dataURL });
    };
    reader.onerror = (error) => {
      toast.error("Error reading file");
      console.error("FileReader error:", error);
      setImageAsset({ isImageLoading: false, imageUrl: null });
    };
    reader.readAsDataURL(file);
  };

  const deleteImageObject = () => {
     if (!isEdit) return;
     setImageAsset({ isImageLoading: false, imageUrl: null });
  };


  // Experience Handlers
  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...experiences];
    updated[index][name] = value;
    setExperiences(updated);
  };
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { title: "New Role", companyLocation: "Company / Location", dates: "Year - Year", description: "Responsibility description." }]);

  // Education Handlers
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...education];
    updated[index][name] = value;
    setEducation(updated);
  };
  const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
  const addEducation = () => setEducation([...education, { university: "University Name", degree: "Degree Name", dates: "Year - Year" }]);

  // Reference Handlers
  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...references];
    updated[index][name] = value;
    setReferences(updated);
  };
  const removeReference = (index) => setReferences(references.filter((_, i) => i !== index));
  const addReference = () => setReferences([...references, { name: "Reference Name", address: "Address", phone: "Phone", email: "Email" }]);

  // Skill Handlers
  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...skills];
    if (name === 'level') {
        // Ensure level is between 0 and 100
        const levelValue = Math.max(0, Math.min(100, Number(value)));
         updated[index][name] = levelValue;
    } else {
         updated[index][name] = value;
    }
    setSkills(updated);
  };
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));
  const addSkill = () => setSkills([...skills, { name: "New Skill", level: 50 }]);


  // --- Saving and Exporting ---
  const saveFormData = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    const toastId = toast.loading("Saving data...");
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user.uid}`;
    const imageUrl = await getImage(); // Get snapshot for preview

    // Ensure image URL is valid (Data URL) before saving, otherwise save null
    const profilePicToSave = imageAsset.imageUrl && imageAsset.imageUrl.startsWith('data:image/')
                             ? imageAsset.imageUrl
                             : null;

    const _doc = {
      _id: loadedTemplateId, // Or generate/use a specific ID
      resume_id,
      formData,
      education,
      experiences,
      skills,
      references,
      timeStamp,
      imageUrl, // Thumbnail URL
      userProfilePic: profilePicToSave, // Actual profile picture data URL or null
    };

    console.log("Attempting to save document:", _doc);
    setDoc(doc(db, "users", user.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.update(toastId, { render: "Data Saved Successfully!", type: "success", isLoading: false, autoClose: 3000 });
        if (refetch_resumeData) refetch_resumeData();
      })
      .catch((err) => {
        toast.update(toastId, { render: `Error Saving: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
        console.error("Save Error:", err);
      });
  };

   const getImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.error("Resume element not found for capture.");
      return null;
    }
    // Ensure the element is fully rendered and visible before capturing
    // May need a small delay or ensure layout stability if issues persist
    try {
      const dataUrl = await htmlToImage.toJpeg(element, {
        quality: 0.90, // Slightly lower quality for smaller size
        // Ensure dimensions are reasonable if needed
        // canvasWidth: element.offsetWidth,
        // canvasHeight: element.offsetHeight,
        // Consider pixel ratio for higher resolution screens if needed
         pixelRatio: 1.5 // Capture at 1.5x resolution
      });
      return dataUrl;
    } catch (error) {
      toast.error("Failed to capture resume preview image.");
      console.error("Image Capture Error:", error);
      return null;
    }
  };

  // PDF Generation (Adapted from Template3)
  const generatePDF = async () => {
    const element  = resumeRef.current;
    if(!element){
      toast.info("Unable to capture the content");
      return;
    }
    htmlToImage.toPng(element).then((dataUrl)=>{
      const a4Width = 210;
      const a4Height = 297;

      let pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [a4Width, a4Height],  
      })

      const aspectRatio = a4Width / a4Height;
      const imagaeWidth = a4Width;
      const imageHeight = a4Width / aspectRatio;

      const verticalMargin = (a4Height - imageHeight) / 2;

      pdf.addImage(dataUrl, "PNG", 0, verticalMargin, imagaeWidth, imageHeight);
      pdf.save(`${formData.fullname}_Resume.pdf`);
    }).catch((err)=>{
      toast.error(`errror: ${err.message}`);
    })
  };
    // Image Generation (JPEG, PNG, SVG) - Adapted from Template3
  const generateImage = async (format = "jpeg") => {
    const element = resumeRef.current;
    if (!element) {
      toast.error("Unable to capture content.");
      return;
    }
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);

    try {
      let dataUrl;
      let filename = `${formData.fullname}_Resume.${format}`;
      const options = { pixelRatio: 2 }; // Higher quality images

      switch (format) {
        case "png":
          dataUrl = await htmlToImage.toPng(element, options);
          break;
        case "svg":
           // SVG doesn't use pixelRatio, might look different
          dataUrl = await htmlToImage.toSvg(element);
          break;
        case "jpeg":
        default:
          options.quality = 0.95;
          dataUrl = await htmlToImage.toJpeg(element, options);
          filename = `${formData.fullname}_Resume.jpg`;
          break;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      a.click();
      toast.update(toastId, { render: `${format.toUpperCase()} Downloaded!`, type: "success", isLoading: false, autoClose: 2000 });
    } catch (error) {
      toast.update(toastId, { render: `Error generating ${format}: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 });
      console.error("Image Generation Error:", error);
    }
  };

  // Helper to split name for styling
  const getStyledName = (fullname) => {
    const parts = fullname.trim().split(' ');
    if (parts.length < 2) {
        return <span className="text-gray-800">{fullname}</span>;
    }
    const firstName = parts.slice(0, -1).join(' ');
    const lastName = parts.slice(-1)[0];
    return (
        <>
            <span className="text-gray-800">{firstName} </span>
            <span className="text-yellow-500">{lastName}</span>
        </>
    );
  };


  // --- RENDER ---
  return (
     <div className="flex flex-col items-center justify-start gap-4 p-4 lg:p-8 font-sans"> {/* Using a common sans-serif */}
      {/* Controls - Same as Template3 */}
       <div className="w-full max-w-4xl flex items-center justify-end gap-4 mb-4 px-4 print:hidden">
         <div
           className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer shadow-sm"
           onClick={toggleEditable}
         >
           {isEdit ? <FaPenToSquare className="text-sm text-gray-700" /> : <FaPencilAlt className="text-sm text-gray-700" />}
           <p className="text-sm text-gray-700">Edit</p>
         </div>
         <button
           className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-sm disabled:opacity-50"
           onClick={saveFormData}
           disabled={!user}
         >
           <BiSolidBookmarks className="text-sm" />
           <p className="text-sm">Save</p>
         </button>
         <div className="flex items-center justify-center gap-2">
           <p className="text-sm text-gray-600">Download:</p>
           <BsFiletypePdf className="text-xl text-red-500 hover:text-red-700 cursor-pointer" onClick={generatePDF} title="Download PDF" />
           <BsFiletypePng onClick={() => generateImage('png')} className="text-xl text-green-500 hover:text-green-700 cursor-pointer" title="Download PNG" />
           <BsFiletypeJpg className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer" onClick={() => generateImage('jpeg')} title="Download JPG" />
           <BsFiletypeSvg onClick={() => generateImage('svg')} className="text-xl text-purple-500 hover:text-purple-700 cursor-pointer" title="Download SVG" />
         </div>
       </div>

       {/* Resume Template - A4 Aspect Ratio Approximation */}
       <div className="w-full max-w-4xl min-h-[1123px] bg-white shadow-lg overflow-hidden" ref={resumeRef}>
            <div className="grid grid-cols-12 min-h-[1123px]"> {/* Ensure grid takes full height */}

                {/* Left Column (Dark) */}
                <div className="col-span-12 md:col-span-4 bg-[#2d2d2d] text-white p-6 pt-10 relative">
                    {/* Diagonal Background - Approximation using absolute div and clip-path */}
                    <div className="absolute top-0 left-0 w-full h-48 bg-yellow-500" style={{clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0% 100%)'}}></div>

                    {/* Profile Image Section */}
                    <div className="relative z-10 flex justify-center mb-8 -mt-4">
                        <div className="w-36 h-36 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-md group">
                            <label htmlFor="profile-pic-upload" className={`w-full h-full block cursor-${isEdit ? 'pointer' : 'default'}`}>
                                {imageAsset.isImageLoading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-400">
                                        <FaSpinner className="animate-spin text-3xl text-white" />
                                    </div>
                                ) : imageAsset.imageUrl ? (
                                    <img src={imageAsset.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    // Placeholder visual when no image and not loading
                                     <div className="w-full h-full flex flex-col items-center justify-center bg-gray-500 text-white text-center p-2">
                                        <FaUpload className="text-3xl mb-1"/>
                                        <span className="text-xs">{isEdit ? 'Click to Upload' : 'No Image'}</span>
                                    </div>
                                )}
                            </label>
                             {isEdit && (
                                <input
                                    type="file"
                                    id="profile-pic-upload"
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleFileSelect}
                                />
                            )}
                            {/* Delete button appears on hover if image exists and in edit mode */}
                            {isEdit && imageAsset.imageUrl && !imageAsset.isImageLoading && (
                                <div
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={deleteImageObject}
                                    title="Remove Image"
                                >
                                    <FaTrash className="text-white text-xs" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Me */}
                    <div className="mb-8 relative z-10">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4">
                            <span className="w-6 h-6 bg-yellow-500 inline-block rounded-sm mr-1 flex justify-center items-center"> <MdContactPage size={25} /></span> {/* Yellow block icon */}
                            Contact Me
                        </h3>
                        <div className="space-y-3 text-xs">
                            <EditableField icon={<FaPhoneAlt size={10} />} name="phone1" value={formData.phone1} onChange={handleChange} isEdit={isEdit} placeholder="Phone 1"/>
                            <EditableField icon={<FaPhoneAlt size={10} />} name="phone2" value={formData.phone2} onChange={handleChange} isEdit={isEdit} placeholder="Phone 2"/>
                            <EditableField icon={<FaGlobe size={10} />} name="website" value={formData.website} onChange={handleChange} isEdit={isEdit} placeholder="Website"/>
                            <EditableField icon={<FaEnvelope size={10} />} name="email" value={formData.email} onChange={handleChange} isEdit={isEdit} placeholder="Email"/>
                            <EditableField icon={<FaMapMarkerAlt size={10} />} name="addressLine1" value={formData.addressLine1} onChange={handleChange} isEdit={isEdit} placeholder="Address Line 1"/>
                            <EditableField name="addressLine2" value={formData.addressLine2} onChange={handleChange} isEdit={isEdit} placeholder="Address Line 2" className="ml-5"/> {/* Indent second line */}
                        </div>
                    </div>

                    {/* References */}
                    <div className="mb-8 relative z-10">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4">
                           <span className="w-6 h-6 bg-yellow-500 inline-block rounded-sm mr-1 flex justify-center items-center"><GoCrossReference size={20}/></span>
                            References
                        </h3>
                        <div className="space-y-5">
                             <AnimatePresence>
                                {references.map((ref, index) => (
                                    <motion.div key={index} {...opacityINOut(index)} className="flex items-start gap-2 text-xs relative group">
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                                        <div className="flex-grow">
                                            <EditableField name="name" value={ref.name} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Reference Name" className="font-semibold block mb-0.5"/>
                                            <EditableField name="address" value={ref.address} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Address" className="block mb-0.5"/>
                                            <EditableField name="phone" value={ref.phone} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Tel:" className="block mb-0.5"/>
                                            <EditableField name="email" value={ref.email} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Email:" className="block"/>
                                        </div>
                                        {isEdit && (
                                            <motion.div {...fadeInOutWithOpacity} onClick={() => removeReference(index)} className="absolute -right-4 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Reference">
                                                <FaTrash className="text-xs" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                         {isEdit && (
                            <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3">
                                <button onClick={addReference} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-xs">
                                    <FaPlus /> Add Reference
                                </button>
                            </motion.div>
                        )}
                    </div>

                     {/* Education */}
                    <div className="relative z-10">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4">
                           <span className="w-6 h-6 bg-yellow-500 inline-block rounded-sm mr-1 flex justify-center items-center"><MdCastForEducation size={20} /></span>
                            Education
                        </h3>
                         <div className="space-y-5">
                             <AnimatePresence>
                                {education.map((edu, index) => (
                                    <motion.div key={index} {...opacityINOut(index)} className="flex items-start gap-2 text-xs relative group">
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                                        <div className="flex-grow">
                                            <EditableField name="university" value={edu.university} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="University Name" className="font-semibold block mb-0.5"/>
                                            <EditableField name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="Degree" className="block mb-0.5"/>
                                            <EditableField name="dates" value={edu.dates} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="Dates" className="text-gray-400 block"/>
                                        </div>
                                        {isEdit && (
                                            <motion.div {...fadeInOutWithOpacity} onClick={() => removeEducation(index)} className="absolute -right-4 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Education">
                                                <FaTrash className="text-xs" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                         {isEdit && (
                            <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3">
                                <button onClick={addEducation} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-xs">
                                    <FaPlus /> Add Education
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Column (White) */}
                <div className="col-span-12 md:col-span-8 bg-white p-8 pl-12 relative"> {/* Increased left padding for the line */}
                    {/* Vertical Yellow Line */}
                     <div className="absolute left-6 top-8 bottom-8 w-1 bg-yellow-500"></div> {/* Adjusted position */}

                     {/* Name and Title Header */}
                    <div className="mb-10 pl-4"> {/* Added padding to content */}
                         {isEdit ? (
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="text-2xl font-bold uppercase tracking-wide outline-none border-b border-gray-300 w-full mb-1 p-1"
                                placeholder="Full Name"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">
                                {getStyledName(formData.fullname)}
                            </h1>
                        )}
                         <EditableField
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            isEdit={isEdit}
                            placeholder="Your Title"
                            className="text-sm text-gray-500 uppercase tracking-wider"
                         />
                    </div>

                    {/* About Me */}
                    <Section title="About Me" icon={<FaUser size={12}/>}>
                        <EditableField
                            as="textarea"
                            name="aboutMe"
                            value={formData.aboutMe}
                            onChange={handleChange}
                            isEdit={isEdit}
                            rows={5}
                            placeholder="Tell us about yourself..."
                            className="text-sm text-gray-600 leading-relaxed w-full"
                        />
                    </Section>

                    {/* Job Experience */}
                    <Section title="Job Experience" icon={<FaBriefcase size={12}/>}>
                        <AnimatePresence>
                            {experiences.map((exp, index) => (
                                <motion.div key={index} {...opacityINOut(index)} className="flex items-start gap-3 mb-5 relative group">
                                     <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <EditableField name="title" value={exp.title} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Job Title" className="text-base font-semibold text-gray-800"/>
                                            <EditableField name="dates" value={exp.dates} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Dates" className="text-xs text-gray-500 text-right flex-shrink-0 ml-4"/>
                      </div>
                      <div className="flex flex-col">
                        <EditableField name="companyLocation" value={exp.companyLocation} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Company / Location" className="text-sm text-gray-600 mb-1 italic"/>
                        <EditableField as="textarea" name="description" value={exp.description} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Job description..." rows={3} className="text-xs text-gray-600 leading-normal"/>

                      </div>
                    </div>
                                    {isEdit && (
                                        <motion.div {...fadeInOutWithOpacity} onClick={() => removeExperience(index)} className="absolute right-0 -top-1 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Experience">
                                            <FaTrash className="text-xs" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                         {isEdit && (
                            <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3">
                                <button onClick={addExperience} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                                    <FaPlus /> Add Experience
                                </button>
                            </motion.div>
                        )}
                    </Section>

                    {/* Skills */}
                    <Section title="Skills" icon={<FaCog size={12}/>}>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                             <AnimatePresence>
                                {skills.map((skill, index) => (
                                    <motion.div key={index} {...opacityINOut(index)} className="relative group">
                                        <EditableField name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} isEdit={isEdit} placeholder="Skill Name" className="text-sm text-gray-700 mb-1"/>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 relative">
                                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                                        </div>
                                        {isEdit && (
                                            <>
                                             <input
                                                type="range" // Use range slider for easy level adjustment
                                                name="level"
                                                min="0" max="100" step="5"
                                                value={skill.level}
                                                onChange={(e) => handleSkillChange(index, e)}
                                                className="w-full h-2  cursor-pointer appearance-none mt-1 absolute top-6 left-0 bg-transparent " // Hide default range slider appearance
                                                title={`Level: ${skill.level}%`}
                                                />
                                            <span className="text-xs text-gray-500 absolute -right-8 top-0">{skill.level}%</span>
                                            <motion.div {...fadeInOutWithOpacity} onClick={() => removeSkill(index)} className="absolute right-[-40px] top-4 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Skill">
                                                <FaTrash className="text-xs" />
                                            </motion.div>
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                         {isEdit && (
                            <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-4">
                                <button onClick={addSkill} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                                    <FaPlus /> Add Skill
                                </button>
                            </motion.div>
                        )}
                    </Section>

                     {/* Bottom Right Diagonal Accent */}
                     <div className="absolute bottom-0 right-0 w-2/5 h-20 bg-yellow-500" style={{clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)'}}></div>
                </div>
            </div>
       </div>
     </div>
  );
};

// Helper component for editable fields to reduce repetition
const EditableField = ({ as = 'input', icon, name, value, onChange, isEdit, placeholder, className = '', ...props }) => {
  const commonProps = {
    readOnly: !isEdit,
    name: name,
    value: value,
    onChange: onChange,
    placeholder: isEdit ? placeholder : '',
    className: `outline-none border-none  ${isEdit ? 'bg-gray-100 px-1 py-0.5 rounded border border-gray-300 text-black' : 'bg-transparent'} ${className}`,
    ...props
  };

  const content = as === 'textarea' ? (
    <textarea {...commonProps} style={{ resize: isEdit ? 'vertical' : 'none', minHeight: isEdit ? '40px' : 'auto' }}/>
  ) : (
    <input type="text" {...commonProps} />
  );

  return icon ? (
    <div className="flex items-center gap-2">
      <span className="flex-shrink-0 w-4 text-center">{icon}</span>
      {content}
    </div>
  ) : (
    content
  );
};

// Helper component for sections in the right column
const Section = ({ title, icon, children }) => (
    <div className="mb-8 pl-4"> {/* Added padding to content */}
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
             {/* Circular Yellow Icon with White Inner Icon */}
             <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 rounded-full mr-1 text-white">
                 {icon}
             </span>
            {title}
        </h2>
        {children}
    </div>
);


export default Template5;
