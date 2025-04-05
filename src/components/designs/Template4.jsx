import React, { useState, useRef, useEffect } from 'react';
import {
  FaPencilAlt, FaTrash, FaPlus, FaUser, FaBriefcase, FaGraduationCap,
  FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCog, FaAddressBook,
  FaUpload, FaSpinner, FaLanguage, FaHeart, FaCircle
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
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutWithOpacity, opacityINOut } from "../../animation/index.js";
const Template4 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();

  const resumeRef = useRef(null);

  // Profile Image State
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageUrl: null,
  });

  // --- STATE DEFINITIONS ---
  const [formData, setFormData] = useState({
    fullname: "NOEL TAYLOR",
    title: "GRAPHIC & WEB DESIGNER",
    phone: "+1-718-390-6588", // Single phone in this design
    website: "www.yourwebsite.com",
    address: "789 PrudenceLincoln Park, MI", // Combined address line
    // email: "", // Email seems missing, keep field or remove
    aboutMe: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  });

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

  const [references, setReferences] = useState([
    {
      name: "DARWIN B. MAGANA",
      details: "2813 Shobe Lane Mancos, CO.\nTel: +1-970-533-3393\nEmail: www.yourwebsite.com", // Combined details for simplicity or split later
    },
    {
      name: "ROBERT J. BELVIN",
      details: "2129 Fairfax Drive Newark, NJ.\nTel: +1-908-987-5303\nEmail: www.yourwebsite.com",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      title: "SENIOR WEB DESIGNER",
      companyLocation: "Creative Agency / Chicago",
      dates: "2020 - Present",
      description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type.",
    },
    {
      title: "GRAPHIC DESIGNER",
      companyLocation: "Creative Market / Chicago",
      dates: "2015 - 2020",
      description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type.",
    },
    {
      title: "MARKETING MANAGER",
      companyLocation: "Manufacturing Agency / NJ",
      dates: "2013 - 2015",
      description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type.",
    }
  ]);

  const [skills, setSkills] = useState([
    { name: "Adobe Photoshop", level: 85 },
    { name: "Adobe Illustrator", level: 75 },
    { name: "Microsoft Word", level: 90 },
    { name: "Microsoft Powerpoint", level: 80 },
    { name: "HTML-5 / CSS-3", level: 95 },
  ]);

  // New state for Languages and Hobbies
  const [languages, setLanguages] = useState([
    "ENGLISH", "SPANISH", "FRENCH", "GERMAN"
  ]);
  const [hobbies, setHobbies] = useState([
    "READING BOOKS", "TRAVELING", "PLAYING CHESS"
  ]);


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

  // --- Effect to Load Data ---
  useEffect(() => {
    if (resumeData) {
      setFormData(resumeData.formData || formData);
      setEducation(resumeData.education || education);
      setReferences(resumeData.references || references);
      setExperiences(resumeData.experiences || experiences);
      setSkills(resumeData.skills || skills);
      setLanguages(resumeData.languages || languages); // Load languages
      setHobbies(resumeData.hobbies || hobbies);       // Load hobbies
      if (resumeData.userProfilePic) {
        setImageAsset((prev) => ({ ...prev, imageUrl: resumeData.userProfilePic }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditable = () => setIsEdit(!isEdit);

  // Image Handlers (from Template5)
  const handleFileSelect = async (event) => {
    if (!isEdit) return;
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("JPG or PNG files only"); return;
    }
    setImageAsset({ isImageLoading: true, imageUrl: null });
    const reader = new FileReader();
    reader.onload = (e) => setImageAsset({ isImageLoading: false, imageUrl: e.target.result });
    reader.onerror = () => { toast.error("Error reading file"); setImageAsset({ isImageLoading: false, imageUrl: null }); };
    reader.readAsDataURL(file);
  };
  const deleteImageObject = () => { if(isEdit) setImageAsset({ isImageLoading: false, imageUrl: null }); };

  // Experience Handlers
  const handleExpChange = (index, e) => { const { name, value } = e.target; const updated = [...experiences]; updated[index][name] = value; setExperiences(updated); };
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const addExperience = () => setExperiences([...experiences, { title: "New Role", companyLocation: "Company / Location", dates: "Year - Year", description: "Description." }]);

  // Education Handlers
  const handleEducationChange = (index, e) => { const { name, value } = e.target; const updated = [...education]; updated[index][name] = value; setEducation(updated); };
  const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
  const addEducation = () => setEducation([...education, { university: "University", degree: "Degree", dates: "Year - Year" }]);

  // Reference Handlers
  const handleReferenceChange = (index, e) => { const { name, value } = e.target; const updated = [...references]; updated[index][name] = value; setReferences(updated); };
  const removeReference = (index) => setReferences(references.filter((_, i) => i !== index));
  const addReference = () => setReferences([...references, { name: "Reference Name", details: "Contact Details" }]);

  // Skill Handlers
  const handleSkillChange = (index, e) => { const { name, value } = e.target; const updated = [...skills]; if (name === 'level') { updated[index][name] = Math.max(0, Math.min(100, Number(value))); } else { updated[index][name] = value; } setSkills(updated); };
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));
  const addSkill = () => setSkills([...skills, { name: "New Skill", level: 50 }]);

  // Language Handlers
  const handleLanguageChange = (index, e) => { const { value } = e.target; const updated = [...languages]; updated[index] = value; setLanguages(updated); };
  const removeLanguage = (index) => setLanguages(languages.filter((_, i) => i !== index));
  const addLanguage = () => setLanguages([...languages, "New Language"]);

  // Hobby Handlers
  const handleHobbyChange = (index, e) => { const { value } = e.target; const updated = [...hobbies]; updated[index] = value; setHobbies(updated); };
  const removeHobby = (index) => setHobbies(hobbies.filter((_, i) => i !== index));
  const addHobby = () => setHobbies([...hobbies, "New Hobby"]);


  // --- Saving and Exporting ---
  const saveFormData = async () => {
    if (!user) { toast.error("Login required to save."); return; }
    const toastId = toast.loading("Saving...");
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user.uid}`;
    const imageUrl = await getImage();
    const profilePicToSave = imageAsset.imageUrl?.startsWith('data:image/') ? imageAsset.imageUrl : null;

    const _doc = {
      _id: loadedTemplateId, resume_id, timeStamp, imageUrl, // Base fields
      formData, education, references, experiences, skills, // Main sections
      userProfilePic: profilePicToSave,                     // Profile pic
      languages, hobbies                                     // New sections
    };

    setDoc(doc(db, "users", user.uid, "resumes", resume_id), _doc)
      .then(() => { toast.update(toastId, { render: "Saved!", type: "success", isLoading: false, autoClose: 2000 }); if (refetch_resumeData) refetch_resumeData(); })
      .catch((err) => { toast.update(toastId, { render: `Save Error: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("Save Error:", err); });
  };

  const getImage = async () => { /* ... same as Template5 ... */
    const element = resumeRef.current;
    if (!element) { toast.error("Resume element not found."); return null; }
    try { return await htmlToImage.toJpeg(element, { quality: 0.90, pixelRatio: 1.5 }); }
    catch (error) { toast.error("Failed capture preview."); console.error("Capture Error:", error); return null; }
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

  const generateImage = async (format = "jpeg") => { /* ... same as Template5 ... */
    const element = resumeRef.current;
    if (!element) { toast.error("Cannot capture content."); return; }
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);
    try {
      let dataUrl, filename = `${formData.fullname}_Resume.${format}`;
      const options = { pixelRatio: 2 };
      switch (format) {
        case "png": dataUrl = await htmlToImage.toPng(element, options); break;
        case "svg": dataUrl = await htmlToImage.toSvg(element); break; // No pixelRatio for SVG
        default: options.quality = 0.95; dataUrl = await htmlToImage.toJpeg(element, options); filename = `${formData.fullname}_Resume.jpg`; break;
      }
      const a = document.createElement("a"); a.href = dataUrl; a.download = filename; a.click();
      toast.update(toastId, { render: `${format.toUpperCase()} Downloaded!`, type: "success", isLoading: false, autoClose: 2000 });
    } catch (error) { toast.update(toastId, { render: `Image Error: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 }); console.error("Image Error:", error); }
  };

  // --- RENDER ---
  // Define the primary teal color for easier reuse
  const primaryColor = "teal-500"; // Example: Tailwind's teal-500
  const primaryBgColor = "bg-teal-500";
  const lightBgColor = "bg-teal-50"; // Very light teal for left column background

  return (
    <div className="flex flex-col items-center justify-start gap-4 p-4 lg:p-8 font-sans">
      <div className="w-full flex items-center gap-2 px-4">
        <Link to={"/"} className="flex items-center justify-center gap-2 text-txtPrimary"> <FaHouse /> Home </Link>
        <p className="text-txtPrimary cursor-pointer" onClick={() => navigate(-1)}> / {templateName} / </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] flex flex-col items-center justify-start px-4 md:px-8 lg:px-16">

        {/* Controls - Same as before */}
        <div className="w-full max-w-4xl flex items-center justify-end gap-4 mb-4 px-4 print:hidden">
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
          <div className="flex items-center justify-center gap-2"> 
            <p className="text-sm text-gray-600">
              Download:
            </p> 
            <BsFiletypePdf className="text-xl text-red-500 hover:text-red-700 cursor-pointer" onClick={generatePDF} title="Download PDF" />
            <BsFiletypePng onClick={() => generateImage('png')} className="text-xl text-green-500 hover:text-green-700 cursor-pointer" title="Download PNG" />
            <BsFiletypeJpg className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer" onClick={() => generateImage('jpeg')} title="Download JPG" />
            <BsFiletypeSvg onClick={() => generateImage('svg')} className="text-xl text-purple-500 hover:text-purple-700 cursor-pointer" title="Download SVG" />
          </div>
        </div>

        {/* Resume Template */}
        <div className={`w-full max-w-4xl min-h-[1123px] bg-white shadow-lg overflow-hidden border-t-4 border-${primaryColor}`} ref={resumeRef}> {/* Added top border */}
          <div className="grid grid-cols-12 min-h-[calc(1123px-4px)]"> {/* Adjust height for border */}

            {/* Left Column (Light Teal Background) */}
            <div className={`col-span-12 md:col-span-4 ${lightBgColor} text-gray-700 p-6 pt-8 relative`}>
              {/* Name and Title */}
              <div className="mb-6 text-center">
                <EditableField name="fullname" value={formData.fullname} onChange={handleChange} isEdit={isEdit} placeholder="Full Name" className={`text-xl font-bold uppercase tracking-wide text-gray-800 text-center ${isEdit ? 'border-b border-gray-300' : ''}`} />
                <EditableField name="title" value={formData.title} onChange={handleChange} isEdit={isEdit} placeholder="Your Title" className="text-xs uppercase tracking-wider text-gray-600 text-center" />
              </div>

              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <div className={`w-36 h-36 rounded-full border-4 border-white ${imageAsset.imageUrl ? '' : 'bg-gray-300'} overflow-hidden shadow-md group relative`}>
                  <label htmlFor="profile-pic-upload" className={`w-full h-full block cursor-${isEdit ? 'pointer' : 'default'}`}>
                    {imageAsset.isImageLoading ? ( <div className="w-full h-full flex items-center justify-center bg-gray-400"><FaSpinner className="animate-spin text-3xl text-white" /></div> )
                      : imageAsset.imageUrl ? ( <img src={imageAsset.imageUrl} alt="Profile" className="w-full h-full object-cover" /> )
                        : ( <div className="w-full h-full flex flex-col items-center justify-center bg-gray-400 text-white text-center p-2"><FaUpload className="text-3xl mb-1"/><span className="text-xs">{isEdit ? 'Upload Image' : 'No Image'}</span></div> )}
                  </label>
                  {isEdit && <input type="file" id="profile-pic-upload" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileSelect} />}
                  {isEdit && imageAsset.imageUrl && !imageAsset.isImageLoading && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={deleteImageObject} title="Remove Image">
                      <FaTrash className="text-white text-xs" />
                    </div> )}
                </div>
              </div>

              {/* Contact Me */}
              <LeftSection title="Contact Me" icon={<FaUser />} color={primaryColor}>
                <div className="space-y-2 text-xs">
                  <EditableField icon={<FaPhoneAlt size={10} className={`text-${primaryColor}`} />} name="phone" value={formData.phone} onChange={handleChange} isEdit={isEdit} placeholder="Phone" />
                  <EditableField icon={<FaGlobe size={10} className={`text-${primaryColor}`} />} name="website" value={formData.website} onChange={handleChange} isEdit={isEdit} placeholder="Website" />
                  <EditableField icon={<FaMapMarkerAlt size={10} className={`text-${primaryColor}`} />} name="address" value={formData.address} onChange={handleChange} isEdit={isEdit} placeholder="Address" />
                  {/* <EditableField icon={<FaEnvelope size={10} className={`text-${primaryColor}`} />} name="email" value={formData.email} onChange={handleChange} isEdit={isEdit} placeholder="Email"/> */}
                </div>
              </LeftSection>

              {/* Education */}
              <LeftSection title="Education" icon={<FaGraduationCap />} color={primaryColor}>
                <div className="space-y-4">
                  <AnimatePresence>
                    {education.map((edu, index) => (
                      <motion.div key={index} {...opacityINOut(index)} className="text-xs relative group">
                        <EditableField name="university" value={edu.university} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="University" className="font-semibold block mb-0.5 uppercase"/>
                        <EditableField name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="Degree" className="block text-gray-600"/>
                        <EditableField name="dates" value={edu.dates} onChange={(e) => handleEducationChange(index, e)} isEdit={isEdit} placeholder="Dates" className="text-gray-500 block text-[10px]"/>
                        {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeEducation(index)} className="absolute right-0 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Edu"><FaTrash className="text-xs" /></motion.div>)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-2"><button onClick={addEducation} className={`text-${primaryColor} hover:text-teal-700 flex items-center gap-1 text-xs`}><FaPlus /> Add Education</button></motion.div> )}
              </LeftSection>

              {/* References */}
              <LeftSection title="References" icon={<FaAddressBook />} color={primaryColor}>
                <div className="space-y-4">
                  <AnimatePresence>
                    {references.map((ref, index) => (
                      <motion.div key={index} {...opacityINOut(index)} className="text-xs relative group">
                        <EditableField name="name" value={ref.name} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Reference Name" className="font-semibold block mb-1 uppercase"/>
                        {/* Using textarea for multi-line details */}
                        <EditableField as="textarea" name="details" value={ref.details} onChange={(e) => handleReferenceChange(index, e)} isEdit={isEdit} placeholder="Contact Details (Address, Tel, Email)" rows={5} className="text-gray-600 leading-snug"/>
                        {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeReference(index)} className="absolute right-0 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Ref"><FaTrash className="text-xs" /></motion.div>)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-2"><button onClick={addReference} className={`text-${primaryColor} hover:text-teal-700 flex items-center gap-1 text-xs`}><FaPlus /> Add Reference</button></motion.div> )}
              </LeftSection>

            </div>

            {/* Vertical Separator Line */}


            {/* Right Column (White Background) */}
            <div className="col-span-12 md:col-span-8 bg-white p-8 relative">
              {/* About Me */}
              <RightSection title="About Me" icon={<FaUser />} color={primaryColor}>
                <EditableField as="textarea" name="aboutMe" value={formData.aboutMe} onChange={handleChange} isEdit={isEdit} rows={5} placeholder="About you..." className="text-sm text-gray-600 leading-relaxed w-full" />
              </RightSection>

              {/* Job Experience */}
              <RightSection title="Job Experience" icon={<FaBriefcase />} color={primaryColor}>
                <AnimatePresence>
                  {experiences.map((exp, index) => (
                    <motion.div key={index} {...opacityINOut(index)} className="mb-5 relative group pl-5"> {/* Indent content */}
                      <span className={`absolute left-0 top-1.5 w-2 h-2 ${primaryBgColor} rounded-full`}></span> {/* Bullet point */}
                      <div className="flex justify-between items-start mb-1">
                        {/* Flex item for title - allow grow */}
                        <div className="flex-grow mr-4">
                          <EditableField name="title" value={exp.title} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Job Title" className="text-base font-semibold text-gray-800"/>
                        </div>
                        {/* Flex item for dates - no grow, shrink */}
                        <div className="flex-shrink-0">
                          <EditableField name="dates" value={exp.dates} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Dates" className="text-xs text-gray-500 text-right"/>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <EditableField name="companyLocation" value={exp.companyLocation} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Company / Location" className="text-sm text-gray-600 mb-1 italic"/>
                        <EditableField as="textarea" name="description" value={exp.description} onChange={(e) => handleExpChange(index, e)} isEdit={isEdit} placeholder="Job description..." rows={3} className="text-xs text-gray-600 leading-normal"/>

                      </div>
                      {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeExperience(index)} className="absolute right-0 -top-1 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Exp"><FaTrash className="text-xs" /></motion.div>)}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3"><button onClick={addExperience} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"><FaPlus /> Add Experience</button></motion.div> )}
              </RightSection>

              {/* Skills */}
              <RightSection title="Skills" icon={<FaCog />} color={primaryColor}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <AnimatePresence>
                    {skills.map((skill, index) => (
                      <motion.div key={index} {...opacityINOut(index)} className="relative group">
                        <EditableField name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} isEdit={isEdit} placeholder="Skill Name" className="text-sm text-gray-700 mb-1"/>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 relative overflow-hidden"> {/* Bar container */}
                          <div className={`h-1.5 rounded-full ${primaryBgColor}`} style={{ width: `${skill.level}%` }}></div> {/* Bar */}
                        </div>
                        {isEdit && (
                          <>
                            {/* Overlay range input for level adjustment */}
                            <input type="range" name="level" min="0" max="100" step="5" value={skill.level} onChange={(e) => handleSkillChange(index, e)} className="w-full h-2 bg-transparent cursor-pointer appearance-none mt-1 absolute top-6 left-0 " title={`Level: ${skill.level}%`} />
                            <span className="text-xs text-gray-500 absolute -right-8 top-4">{skill.level}%</span>
                            <motion.div {...fadeInOutWithOpacity} onClick={() => removeSkill(index)} className="absolute right-[-25px] top-8 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100" title="Remove Skill"><FaTrash className="text-xs" /></motion.div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-4"><button onClick={addSkill} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"><FaPlus /> Add Skill</button></motion.div> )}
              </RightSection>

              {/* Languages & Hobbies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {/* Languages */}
                <RightSection title="Language" icon={<FaLanguage />} color={primaryColor}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <AnimatePresence>
                      {languages.map((lang, index) => (
                        <motion.div key={index} {...opacityINOut(index)} className="flex items-center text-sm relative group">
                          <span className={`w-1.5 h-1.5 ${primaryBgColor} rounded-full mr-2 flex-shrink-0`}></span>
                          <EditableField name={`language-${index}`} value={lang} onChange={(e) => handleLanguageChange(index, e)} isEdit={isEdit} placeholder="Language" className="text-gray-700"/>
                          {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeLanguage(index)} className="absolute right-0 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Lang"><FaTrash className="text-xs" /></motion.div>)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3"><button onClick={addLanguage} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs"><FaPlus /> Language</button></motion.div> )}
                </RightSection>

                {/* Hobbies */}
                <RightSection title="Hobbies" icon={<FaHeart />} color={primaryColor}>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {hobbies.map((hobby, index) => (
                        <motion.div key={index} {...opacityINOut(index)} className="flex items-center text-sm relative group">
                          <span className={`w-1.5 h-1.5 ${primaryBgColor} rounded-full mr-2 flex-shrink-0`}></span>
                          <EditableField name={`hobby-${index}`} value={hobby} onChange={(e) => handleHobbyChange(index, e)} isEdit={isEdit} placeholder="Hobby" className="text-gray-700"/>
                          {isEdit && (<motion.div {...fadeInOutWithOpacity} onClick={() => removeHobby(index)} className="absolute right-0 top-0 cursor-pointer text-red-400 opacity-0 group-hover:opacity-100" title="Remove Hobby"><FaTrash className="text-xs" /></motion.div>)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {isEdit && ( <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-3"><button onClick={addHobby} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs"><FaPlus /> Hobby</button></motion.div> )}
                </RightSection>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


// --- Helper Components ---

// Editable Field (Adapted - Removed default w-full, uses className prop for layout control)
const EditableField = ({ as = 'input', icon, name, value, onChange, isEdit, placeholder, className = '', inputClassName = '', ...props }) => {
  const commonProps = {
    readOnly: !isEdit, name, value, onChange,
    placeholder: isEdit ? placeholder : '',
    className: `outline-none border-none ${isEdit ? 'bg-gray-100 px-1 py-0.5 rounded border border-gray-300' : 'bg-transparent'} ${inputClassName}`, // Removed w-full
    ...props
  };
  const content = as === 'textarea' ? <textarea {...commonProps} style={{ resize: isEdit ? 'vertical' : 'none', minHeight: isEdit ? '40px' : 'auto' }}/> : <input type="text" {...commonProps} />;

  // Apply main className to wrapper if icon exists, otherwise combine it with input's classes
  if (icon) {
    return ( <div className={`flex items-center gap-2 ${className}`}> <span className="flex-shrink-0 w-4 text-center">{icon}</span> <div className="flex-grow">{content}</div> </div> ); // Wrap content in flex-grow
  } else {
    const finalClassName = `${commonProps.className} ${className}`; // Combine classes
    return React.cloneElement(content, { className: finalClassName });
  }
};


// Section for Left Column
const LeftSection = ({ title, icon, color = "teal-500", children }) => (
  <div className="mb-6">
    <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-${color}/30 text-gray-700`}>
      {/* Circular Icon */}
      <span className={`flex items-center justify-center w-5 h-5 bg-${color} rounded-full text-white flex-shrink-0`}>
        {React.cloneElement(icon, { size: 10 })} {/* Smaller icon */}
      </span>
      {title}
    </h3>
    {children}
  </div>
);

// Section for Right Column
const RightSection = ({ title, icon, color = "teal-500", children }) => (
  <div className="mb-8">
    <h2 className={`flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider mb-4`}>
      {/* Circular Icon */}
      <span className={`flex items-center justify-center w-6 h-6 bg-${color} rounded-full text-white flex-shrink-0`}>
        {React.cloneElement(icon, { size: 12 })} {/* Slightly larger icon */}
      </span>
      {title}
    </h2>
    {children}
  </div>
);

export default Template4;
