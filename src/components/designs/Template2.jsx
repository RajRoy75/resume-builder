import React, { useState, useRef, useEffect } from 'react';
import {
  FaPencilAlt, FaTrash, FaPlus, FaUser, FaBriefcase, FaGraduationCap,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCog, FaAddressBook, FaHeart,
  FaUpload, FaSpinner
} from 'react-icons/fa';
import { FaPenToSquare, FaHouse } from "react-icons/fa6";
import { BiSolidBookmarks } from 'react-icons/bi';
import { BsFiletypePdf, BsFiletypePng, BsFiletypeJpg, BsFiletypeSvg } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import useUser from "../../hooks/useUser";
import { getTemplateDetailEditByUser } from "../../api";
import * as htmlToImage from "html-to-image";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase.config";
import jsPDF from "jspdf";
import { TemplateTwo } from "../../assets";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutWithOpacity, opacityINOut} from "../../animation/index.js";

const EditableField = ({ as = 'input', name, value, onChange, isEdit, placeholder, className = '', inputClassName = '', readOnly = !isEdit, ...props }) => {
    const commonProps = {
      readOnly: readOnly,
      name: name,
      value: value,
      onChange: onChange,
      placeholder: isEdit ? placeholder : '',
      className: `outline-none border-none bg-transparent ${isEdit ? ' px-1 py-0.5 rounded border border-gray-300' : ''} ${inputClassName}`,
      ...props
    };

    const element = as === 'textarea'
      ? <textarea {...commonProps} style={{ resize: isEdit ? 'vertical' : 'none', minHeight: 'auto', ...props.style }}/>
      : <input type={props.type || "text"} {...commonProps} />;

    const finalClassName = `${commonProps.className} ${className}`;
    return React.cloneElement(element, { className: finalClassName });
};


const Template2 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1)[0] || "template2"; // Default name
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();
  const resumeRef = useRef(null);

  // --- State ---
  const [imageAsset, setImageAsset] = useState({ isImageLoading: false, imageUrl: null });
  const [formData, setFormData] = useState({
    fullname: "Mathew Smith",
    professionalTitle: "UI DESIGNER",
    personalDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua incididunt.",
    mobile: "+123 456 789",
    email: "example@mail.com",
    address: "123 Street Address, City"
  });
  const [education, setEducation] = useState([
    { 
      major: "ENTER YOUR MAJOR", 
      university: "Name of your university / 2015-2019" 
    },
    { 
      major: "ENTER YOUR MAJOR", 
      university: "Name of your university / 2009-2011" 
    }
  ]);
  const [experiences, setExperiences] = useState([
    {
      year: "2019 - Present", 
      title: "Enter Job Position Here", 
      companyAndLocation: "Company Name / Location", 
      description: "Lorem ipsum dolor sit amet, this is a chance for personal branding text. add any relevant completed initiatives or duties." 
    },
    { 
      year: "2015 - 2019",
      title: "Enter Job Position Here",
      companyAndLocation: "Company Name / Location",
      description: "Lorem ipsum dolor sit amet, this is a chance for personal branding text. add any relevant completed initiatives or duties."
    }
  ]);
  const [skills, setSkills] = useState([
    {
      title: "Photoshop",
      percentage: "85"
    },
    {
      title: "Illustrator",
      percentage: "75"
    },
    {
      title: "InDesign",
      percentage: "65"
    },
    {
      title: "Word",
      percentage: "95"
    },
    {
      title: "Power point",
      percentage: "85"
    }
  ]);
  const [referees, setReferees] = useState([
    { 
      name: "Gloria M. Gregory", 
      role: "Electric Micro Media ltd", 
      phone: "459-123-456" 
    },
    { 
      name: "Jennifer S. Garcia", 
      role: "Director Micro Media limited", 
      phone: "459-124-456" 
    }
  ]);
   const [interests, setInterests] = useState(["Travel", "Music", "Writing", "Chess"]); // Keep interests

  // --- Data Fetching ---
   const {
     data: resumeData,
     isLoading: resume_isLoading,
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
       setReferees(resumeData.referees || referees); // Load referees
       setInterests(resumeData.interests || interests); // Load interests
       if (resumeData.userProfilePic) {
         setImageAsset((prev) => ({ ...prev, imageUrl: resumeData.userProfilePic }));
       }
     }
   }, [resumeData]);

   useEffect(() => {
     console.log("Current imageAsset:", { isLoading: imageAsset.isImageLoading, urlLength: imageAsset.imageUrl?.length });
   }, [imageAsset]);


  // --- Handlers ---
  const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const toggleEditable = () => setIsEdit(!isEdit); // Simplified

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
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target; 
    const updated = [...education]; updated[index][name] = value;
    setEducation(updated); 
  };
  const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
  const addEducation = () => setEducation([...education, { major: "NEW MAJOR", university: "University Name / Year - Year" }]);

  // Experience Handlers
  const handleExpChange = (index, e) => {
    const { name, value } = e.target; 
    const updated = [...experiences]; 
    updated[index][name] = value; setExperiences(updated); 
  };
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { year: "Year - Year", title: "New Position", companyAndLocation: "Company / Location", description: "Description." }]);

  // Skills Handlers
  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target; 
    const updated = [...skills];
    if(name === 'percentage'){
      updated[index][name] = Math.max(0, Math.min(100, Number(value) || 0))
    } else {
      updated[index][name] = value
    }; 
    setSkills(updated); 
  };
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));
  const addSkill = () => setSkills([...skills, { title: "New Skill", percentage: "50" }]);

  // Referees Handlers
  const handleRefereesChange = (index, e) => {
    const { name, value } = e.target; 
    const updated = [...referees]; 
    updated[index][name] = value; setReferees(updated); };
  const removeReferee = (index) => setReferees(referees.filter((_, i) => i !== index));
  const addReferee = () => setReferees([...referees, { name: "Reference Name", role: "Title, Company", phone: "Phone Number" }]);

  // Interests Handlers (Simple text array)
  const handleInterestChange = (index, e) => {
    const { value } = e.target; 
    const updated = [...interests]; 
    updated[index] = value; setInterests(updated); };
  const removeInterest = (index) => setInterests(interests.filter((_, i) => i !== index));
  const addInterest = () => setInterests([...interests, "New Interest"]);


  // --- Saving and Exporting ---
  const saveFormData = async () => {
    if (!user) { toast.error("Login required to save."); return; }
    const toastId = toast.loading("Saving...");
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user.uid}`;
    const imageUrl = await getImage();
    const profilePicToSave = imageAsset.imageUrl?.startsWith('data:image/') ? imageAsset.imageUrl : null;

    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      timeStamp,
      imageUrl,
      userProfilePic: profilePicToSave,
      formData,
      education,
      experiences,
      skills,
      referees,
      interests
    };

    setDoc(doc(db, "users", user.uid, "resumes", resume_id), _doc)
      .then(() => { toast.update(toastId, { render: "Saved!", type: "success", isLoading: false, autoClose: 2000 }); if (refetch_resumeData) refetch_resumeData(); })
      .catch((err) => { toast.update(toastId, { render: `Save Error: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("Save Error:", err); });
  };

  const getImage = async () => {
    const element = resumeRef.current; 
    if (!element) { 
      toast.error("Resume element not found.");
      return null;
    }
    try { 
      return await htmlToImage.toJpeg(element, { quality: 0.90, pixelRatio: 1.5 });
    } catch (error) {
      toast.error("Failed capture preview."); 
      console.error("Capture Error:", error); return null; 
    }
  };

const generatePDF = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.error("Cannot capture content: Resume element not found.");
      return;
    }

    const toastId = toast.loading("Generating PDF...");

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio: 2,
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const imgWidthPx = img.width;
        const imgHeightPx = img.height;
        const aspectRatio = imgWidthPx / imgHeightPx;

        const tempPdf = new jsPDF('p', 'mm', 'a4');
        const pdfPageWidthMm = tempPdf.internal.pageSize.getWidth();

        const pdfPageHeightMm = pdfPageWidthMm / aspectRatio;

        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [pdfPageWidthMm, pdfPageHeightMm] // Custom page size [width, height]
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPageWidthMm, pdfPageHeightMm);

        pdf.save(`${formData.fullname}_Resume.pdf`);
        toast.update(toastId, { render: "PDF Generated!", type: "success", isLoading: false, autoClose: 3000 });
      };

      img.onerror = (error) => {
        console.error("Image loading failed:", error);
        toast.update(toastId, { render: "Image load failed.", type: "error", isLoading: false, autoClose: 3000 });
      };

    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.update(toastId, { render: `PDF Error: ${error.message || 'Unknown error'}`, type: "error", isLoading: false, autoClose: 3000 });
    }
  };


  const generateImage = async (format = "jpeg") => {
    const element = resumeRef.current;
    if (!element) { toast.error("Cannot capture content.");
      return; } const toastId = toast.loading(`Generating ${format.toUpperCase()}...`); 
    try {
      let dataUrl, filename = `${formData.fullname}_Resume.${format}`; 
      const options = { pixelRatio: 2 };
      switch (format) {
        case "png": 
          dataUrl = await htmlToImage.toPng(element, options); 
          break; 
        case "svg": 
          dataUrl = await htmlToImage.toSvg(element); 
          break; 
        default: 
          options.quality = 0.95; 
          dataUrl = await htmlToImage.toJpeg(element, options); 
          filename = `${formData.fullname}_Resume.jpg`; break; }
      const a = document.createElement("a"); 
      a.href = dataUrl; 
      a.download = filename; 
      a.click(); 
      toast.update(toastId, { render: `${format.toUpperCase()} Downloaded!`, type: "success", isLoading: false, autoClose: 2000 });
    } catch (error) { 
      toast.update(toastId, { render: `Image Error: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 }); 
      console.error("Image Error:", error); 
    }
  };
   // Separate handlers for PNG/JPG/SVG
   const generatePng = () => generateImage('png');
   const generateJpg = () => generateImage('jpeg');
   const generateSvg = () => generateImage('svg');

  // --- RENDER ---
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 font-sans"> {/* Added padding for smaller screens */}
      <div className="w-full flex items-center gap-2 px-4">
        <Link to={"/"} className="flex items-center justify-center gap-2 text-txtPrimary"> <FaHouse /> Home </Link>
        <p className="text-txtPrimary cursor-pointer" onClick={() => navigate(-1)}> / {templateName} / </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] flex flex-col items-center justify-start px-4 md:px-8 lg:px-16">
      {/* Controls */}
        <div className="w-full flex items-center gap-4 md:gap-8 lg:gap-12 mb-4 px-4">
          <div className="flex gap-2 mx-auto">
            <div
              className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md cursor-pointer shadow-sm transition-colors duration-200 ease-in-out ${isEdit ? 'bg-yellow-200 hover:bg-yellow-300 ring-2 ring-yellow-400' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={toggleEditable}
              title={isEdit ? "Finish Editing" : "Enable Editing"}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm text-yellow-800" />
              ) : (
                  <FaPencilAlt className="text-sm text-txtPrimary" />
                )}
              <p className={`text-sm ${isEdit ? 'text-yellow-800 font-semibold' : 'text-txtPrimary'}`}>{isEdit ? "Editing" : "Edit"}</p>
            </div>
            <button
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-sm disabled:opacity-50 transition-colors duration-200 ease-in-out"
              onClick={saveFormData}
              disabled={!user}
              title="Save Changes"
            >
              <BiSolidBookmarks className="text-sm" />
              <p className="text-sm">Save</p>
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 ml-auto">
            <p className="text-sm text-txtPrimary hidden md:block">Download:</p>
            <BsFiletypePdf
              className="text-xl text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-150"
              onClick={generatePDF}
              title="Download PDF"
            />
            <BsFiletypePng
              onClick={generatePng}
              className="text-xl text-green-500 hover:text-green-700 cursor-pointer transition-colors duration-150"
              title="Download PNG"
            />
            <BsFiletypeJpg
              onClick={generateJpg}
              className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer transition-colors duration-150"
              title="Download JPG"
            />
            <BsFiletypeSvg
              onClick={generateSvg}
              className="text-xl text-purple-500 hover:text-purple-700 cursor-pointer transition-colors duration-150"
              title="Download SVG"
            />
          </div>

        </div>

      {/* Resume Template */}
      {/* Using aspect ratio similar to A4 for container w/ max-w-4xl */}
      <div className="w-full bg-white shadow-lg grid grid-cols-12 min-h-[1123px]" ref={resumeRef}> {/* Approx A4 height */}

          {/* --- Left Sidebar (Dark) --- */}
          <div className="col-span-12 md:col-span-4 bg-black text-gray-100 flex flex-col items-center justify-start">

            {/* Profile Image Section */}
            <div className="relative w-full h-64 md:h-80 bg-gray-800 flex flex-col items-center justify-center group"> {/* Reduced height slightly */}
              <label htmlFor="profile-pic-upload-t2" className={`w-full h-full block cursor-${isEdit ? 'pointer' : 'default'}`}>
                  {imageAsset.isImageLoading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <FaSpinner className="animate-spin text-3xl text-white" />
                      </div>
                  ) : imageAsset.imageUrl ? (
                      <img src={imageAsset.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      // Placeholder when no image - Using the asset directly
                       <img src={TemplateTwo} className="w-full h-full object-cover opacity-50" alt="Placeholder" />
                  )}
              </label>
              {isEdit && ( <input type="file" id="profile-pic-upload-t2" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileSelect} /> )}
              {isEdit && imageAsset.imageUrl && !imageAsset.isImageLoading && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={deleteImageObject} title="Remove Image">
                      <FaTrash className="text-white text-xs" />
                  </div> )}

                {/* Title Badge */}
                <div className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 text-center font-bold py-1.5 px-6 mt-2 inline-block z-10 whitespace-nowrap">
                  <EditableField
                    name="professionalTitle"
                    value={formData.professionalTitle}
                    onChange={handleChange}
                    isEdit={isEdit}
                    placeholder="Your Title"
                    // Use inputClassName for specific styling if EditableField supports it
                    className={`bg-transparent tracking-widest outline-none border-none text-sm font-bold text-center w-full ${isEdit ? "!bg-yellow-400 placeholder:text-gray-600" : ""}`} // Force bg color override in edit
                  />
                </div>
            </div>

            {/* Education Section */}
            <div className="mt-10 mb-4 flex flex-col justify-center px-4 w-full"> {/* Increased top margin */}
              <h3 className="font-bold border-b-2 border-yellow-500 pb-1 mb-3 text-yellow-500 tracking-widest text-sm uppercase">Education</h3>
              <AnimatePresence>
                {education.map((edu, i) => (
                  <motion.div key={i} {...opacityINOut(i)} className="w-full pl-2 mt-3 relative group">
                     <EditableField
                        name="major"
                        value={edu.major}
                        onChange={(e) => handleEducationChange(i, e)}
                        isEdit={isEdit}
                        placeholder="Major / Degree"
                        className={`text-sm font-semibold uppercase text-gray-100 w-full mb-1 ${isEdit && "text-yellow-400 !bg-gray-800"}`}
                      />
                     <EditableField
                        as="textarea"
                        name="university"
                        value={edu.university}
                        onChange={(e) => handleEducationChange(i, e)}
                        isEdit={isEdit}
                        rows={2} // Adjust rows as needed
                        placeholder="University / School / Dates"
                        className={`text-xs text-gray-300 mt-1 w-full leading-tight ${isEdit ? "!bg-gray-800" : "bg-transparent"}`} // Added leading-tight
                        style={{ maxHeight: "auto", minHeight: "30px", resize: "none" }}
                      />
                    {isEdit && (
                      <motion.div {...fadeInOutWithOpacity} onClick={() => removeEducation(i)} className="cursor-pointer absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100" title="Remove Education">
                        <FaTrash className="text-xs" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
               {isEdit && (
                <motion.div {...fadeInOutWithOpacity} onClick={addEducation} className="cursor-pointer self-center mt-2 text-gray-400 hover:text-yellow-500">
                  <FaPlus className="text-sm" />
                </motion.div>
               )}
            </div>

            {/* Expertise/Skills Section */}
            <div className="bg-gray-900 w-full px-4 py-4 mt-auto"> {/* Pushed to bottom */}
              <h3 className="font-bold border-b-2 border-yellow-500 pb-1 mb-4 tracking-widest text-sm uppercase text-gray-200">Expertise</h3>
               <AnimatePresence>
                {skills.map((skill, i) => (
                  <motion.div key={i} {...opacityINOut(i)} className="mb-3 relative group">
                    <div className="flex justify-between items-center mb-1">
                      <EditableField
                        name="title"
                        value={skill.title}
                        onChange={(e) => handleSkillsChange(i, e)}
                        isEdit={isEdit}
                        placeholder="Skill"
                        className={`text-sm text-gray-200 w-4/5 ${isEdit ? "!bg-gray-700" : ""}`}
                      />
                      {isEdit && (
                        <div className='flex items-center w-1/5 justify-end'>
                           <EditableField
                            type="number"
                            name="percentage"
                            value={skill.percentage}
                            onChange={(e) => handleSkillsChange(i, e)}
                            isEdit={isEdit}
                            min="0" max="100"
                            className={`text-xs w-10 text-right text-gray-300 ml-2 ${isEdit ? "!bg-gray-700" : ""}`}
                           />
                           <span className='text-xs text-gray-400'>%</span>
                        </div>
                      )}
                       {!isEdit && ( <span className='text-xs text-gray-400'>{skill.percentage}%</span> )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                    </div>

                    {isEdit && (
                       <motion.div {...fadeInOutWithOpacity} onClick={() => removeSkill(i)} className="cursor-pointer absolute right-[-15px] top-0 text-red-500 opacity-0 group-hover:opacity-100" title="Remove Skill">
                         <FaTrash className="text-xs" />
                       </motion.div>
                     )}
                  </motion.div>
                ))}
              </AnimatePresence>
               {isEdit && (
                <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-2">
                   <button onClick={addSkill} className="cursor-pointer text-gray-400 hover:text-yellow-500">
                     <FaPlus className="text-xs" />
                   </button>
                 </motion.div>
               )}
            </div>

            {/* Contact Details Section */}
            <div className="flex bg-gray-200 p-0 w-full text-gray-900">
              {/* Left yellow icons column */}
              <div className="bg-yellow-500 p-4 flex flex-col justify-start items-center space-y-6 md:space-y-8">
                <FaPhoneAlt className="text-gray-900 text-sm md:text-base" />
                <FaEnvelope className="text-gray-900 text-sm md:text-base" />
                <FaMapMarkerAlt className="text-gray-900 text-sm md:text-base" />
              </div>
              {/* Right content section */}
              <div className="p-3 md:p-4 flex flex-col justify-start space-y-2 flex-grow">
                <div>
                  <p className="text-xs font-bold text-gray-700">Phone</p>
                   <EditableField name="mobile" value={formData.mobile} onChange={handleChange} isEdit={isEdit} placeholder="+1 234 567 890" className={`text-xs md:text-sm w-full ${isEdit ? "!bg-yellow-100" : ""}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Email</p>
                   <EditableField name="email" value={formData.email} onChange={handleChange} isEdit={isEdit} placeholder="your.email@example.com" className={`text-xs md:text-sm w-full ${isEdit ? "!bg-yellow-100" : ""}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Area</p>
                   <EditableField as="textarea" name="address" value={formData.address} onChange={handleChange} isEdit={isEdit} placeholder="City, Country" rows="2" className={`text-xs md:text-sm w-full leading-tight ${isEdit ? "!bg-yellow-100" : ""}`} style={{ resize: "none" }} />
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content (White) --- */}
          {/* Changed col-span to 7, adjust back to 8 if needed */}
          <div className="col-span-12 md:col-span-8 p-6 md:p-8 bg-white text-gray-800">

            {/* Name and Title */}
            <div className="mb-6">
               <EditableField name="fullname" value={formData.fullname} onChange={handleChange} isEdit={isEdit} placeholder="Your Full Name" className={`text-3xl md:text-4xl font-bold w-full mb-1 h-12  ${isEdit ? "!bg-gray-100" : ""}`} />
               {/* Title as badge below name */}
               <div className={`mt-1 inline-block px-2 py-0.5 rounded-md ${isEdit ? 'bg-yellow-400' : 'bg-yellow-500'}`}>
                <EditableField
                  name="professionalTitle" // Reuse the same field as the badge
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  isEdit={isEdit} // Only editable via the badge field for simplicity
                  placeholder="TITLE"
                  className={`bg-transparent outline-none border-none text-xs font-bold text-gray-900 tracking-wide ${isEdit ? "!placeholder:text-gray-600" : ""}`}
                  readOnly={!isEdit} // Make this display-only here if title is edited via badge
                />
              </div>
            </div>

            {/* Profile Section */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase text-gray-800 border-b border-yellow-500 pb-1 mb-3 tracking-wider">Profile</h3>
              <EditableField
                as="textarea"
                name="personalDescription"
                value={formData.personalDescription}
                onChange={handleChange}
                isEdit={isEdit}
                placeholder="Write a brief professional summary..."
                className={`w-full text-sm text-gray-600 leading-relaxed ${isEdit ? "!bg-gray-100" : ""}`}
                rows="4" style={{ resize: "none" }}
              />
            </div>

            {/* Work Experience Section */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase text-gray-800 border-b border-yellow-500 pb-1 mb-4 tracking-wider">Work Experience</h3>
              <AnimatePresence>
                {experiences.map((exp, i) => (
                  <motion.div key={i} {...opacityINOut(i)} className="mb-6 relative group">
                    {/* Title */}
                    <EditableField name="title" value={exp.title} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Job Position / Title" className={`font-bold text-base text-gray-800 w-full mb-1 ${isEdit ? "!bg-gray-100" : ""}`} />
                    {/* Year Badge & Company/Location */}
                    <div className="flex items-center mb-2">
                      <div className={`text-xs px-2 py-0.5 mr-2 rounded ${isEdit ? 'bg-yellow-400' : 'bg-yellow-500'}`}>
                        <EditableField name="year" value={exp.year} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Year - Year" className={`bg-transparent text-gray-900 outline-none border-none text-xs w-full text-center ${isEdit ? "!placeholder:text-gray-600" : ""}`} />
                      </div>
                       <EditableField name="companyAndLocation" value={exp.companyAndLocation} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Company Name / Location" className={`text-xs text-gray-600 w-full ${isEdit ? "!bg-gray-100" : ""}`} />
                    </div>
                    {/* Description */}
                     <EditableField as="textarea" name="description" value={exp.description} onChange={(e) => handleExpChange(i, e)} isEdit={isEdit} placeholder="Key responsibilities and achievements..." rows="3" className={`text-xs text-gray-600 w-full leading-snug ${isEdit ? "!bg-gray-100" : ""}`} style={{ resize: "none" }} />

                    {isEdit && ( <motion.div {...fadeInOutWithOpacity} onClick={() => removeExperience(i)} className="absolute right-0 top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Experience"> <FaTrash className="text-xs" /> </motion.div> )}
                  </motion.div>
                ))}
              </AnimatePresence>
               {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center"> <button onClick={addExperience} className="cursor-pointer text-gray-500 hover:text-yellow-600"> <FaPlus className="text-sm" /> </button> </motion.div> )}
            </div>

            {/* References Section */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase text-gray-800 border-b border-yellow-500 pb-1 mb-3 tracking-wider">Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 <AnimatePresence>
                    {referees.map((referee, i) => (
                      <motion.div key={i} {...opacityINOut(i)} className="mb-2 relative group text-xs">
                        <EditableField name="name" value={referee.name} onChange={(e) => handleRefereesChange(i, e)} isEdit={isEdit} placeholder="Reference Name" className={`font-bold text-sm block mb-0.5 ${isEdit ? "!bg-gray-100" : ""}`} />
                        <EditableField name="role" value={referee.role} onChange={(e) => handleRefereesChange(i, e)} isEdit={isEdit} placeholder="Title, Company" className={`text-gray-600 block mb-0.5 ${isEdit ? "!bg-gray-100" : ""}`} />
                         <div className="flex items-center">
                           <span className="text-gray-600 mr-1">Phone:</span>
                           <EditableField name="phone" value={referee.phone} onChange={(e) => handleRefereesChange(i, e)} isEdit={isEdit} placeholder="Contact Number" className={`text-gray-600 flex-grow ${isEdit ? "!bg-gray-100" : ""}`} />
                         </div>
                         {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeReferee(i)} className="absolute right-0 top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Referee"><FaTrash className="text-xs" /></motion.div>)}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
               {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-start mt-2"> <button onClick={addReferee} className="cursor-pointer text-gray-500 hover:text-yellow-600"> <FaPlus className="text-sm" /> Add Reference</button> </motion.div> )}
            </div>

            {/* Interests Section */}
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-800 border-b border-yellow-500 pb-1 mb-3 tracking-wider">Interests</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <AnimatePresence>
                    {interests.map((interest, i) => (
                      <motion.div key={i} {...opacityINOut(i)} className="flex flex-col items-center relative group">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mb-1 text-xl text-gray-900">
                          {/* Basic Emoji Mapping - Can be improved */}
                          {interest.toLowerCase().includes("travel") && "✈️"}
                          {interest.toLowerCase().includes("music") && "🎵"}
                          {interest.toLowerCase().includes("writing") && "✏️"}
                          {interest.toLowerCase().includes("chess") && "♟️"}
                          {interest.toLowerCase().includes("reading") && "📚"}
                          {/* Add more or a default icon */}
                          {!["travel", "music", "writing", "chess", "reading"].some(term => interest.toLowerCase().includes(term)) && <FaHeart size={16}/>}
                        </div>
                         <EditableField name={`interest-${i}`} value={interest} onChange={(e) => handleInterestChange(i, e)} isEdit={isEdit} placeholder="Interest" className={`text-xs text-center w-16 truncate ${isEdit ? "!bg-gray-100" : ""}`} />
                         {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeInterest(i)} className="absolute -right-2 -top-1 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Interest"><FaTrash className="text-[10px]" /></motion.div>)}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
               {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-start mt-3"> <button onClick={addInterest} className="cursor-pointer text-gray-500 hover:text-yellow-600"> <FaPlus className="text-sm" /> Add Interest</button> </motion.div> )}
            </div>
          </div>
      </div>

      </div>
    </div>
  );
};

export default Template2;
