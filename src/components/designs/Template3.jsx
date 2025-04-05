import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaTrash, FaPlus, FaUser, FaSuitcase, FaGraduationCap, FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaSkype, FaCogs, FaAddressBook } from 'react-icons/fa';
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
import { fadeInOutWithOpacity, opacityINOut} from "../../animation/index.js";

const Template3 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1)
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();

  const resumeRef = useRef(null);

  // --- STATE DEFINITIONS ---
  const [formData, setFormData] = useState({
    fullname: "JENNIFER WATSON",
    title: "USER EXPERIENCE DESIGNER",
    website: "www.jwatson.com",
    aboutMe: "My Name is Henry Watson lorem ipsum id fringilla molestie ornare diam in olestie ipsum etiam etum nonumes ut. Done cporttitor sit dolor shor lorem ipsum ruturm sit amet hictimas sa Done cporttitor dolor sht dolor kiren lorem ipsum molestie pretium ething is the ship lorem ipsum retiumci amet is tudinest moles tum lorem ipsum ahsd at ipsum all the rosen. fringilla lorem ipsum.",
    mobile: "02800200",
    home: "02800200",
    email: "johnwatson@gmail.com",
    address: "12th Avenue Street Australia 40000",
    skype: "username",
  });

  const [experiences, setExperiences] = useState([
    {
      title: "GRAPHIC DESIGNER",
      company: "SOFT DESIGN STUDIOS",
      dates: "2015 - 2017",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time. Done cporttitor.",
    },
    {
      title: "WEB DESIGNER",
      company: "WEB TECH LTD",
      dates: "2013 - 2015",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time. Done cporttitor.",
    },
    {
      title: "LEAD WEB DESIGNER",
      company: "DEV CREATIVE SOLUTIONS",
      dates: "2010 - 2013",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time. Done cporttitor.",
    }
  ]);

  const [education, setEducation] = useState([
    {
      degree: "CERTIFICATE OF WEB TRAINING",
      university: "UNIVERSITY OF LOREM",
      dates: "2008 - 2010",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time.",
    },
    {
      degree: "BECHELOR OF ART DIRECTOR",
      university: "UNIVERSITY OF LOREM",
      dates: "2007 - 2009",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time. Done cporttitor.",
    },
    {
      degree: "BECHELOR OF ART DIRECTOR",
      university: "UNIVERSITY OF LOREM",
      dates: "2007 - 2009",
      description: "Porttitor amet massa Done cporttitor dolor et nisl molestie tum feliscon lore. Ipsum dolor stringilla lorem lorem ipsum, olicitudin est dolor time. Done cporttitor.",
    }
  ]);

  const [skills, setSkills] = useState([
    { name: "SKILL 01", level: 5 }, // Level 1-5 for the dots
    { name: "SKILL 02", level: 3 },
    { name: "SKILL 03", level: 4 },
    { name: "SKILL 04", level: 2 },
    { name: "SKILL 05", level: 3 },
  ]);

  const [references, setReferences] = useState([
    {
      name: "WILLIAM KLEIMAN",
      title: "Director, Matrix media limited",
      phone: "+555 123 5566",
      email: "williamkleiman@gmail.com"
    },
    {
      name: "JENSEN SMITH",
      title: "Web developer, Design mate LTD",
      phone: "+123 5556 4455",
      email: "jensonsmith@gmail.com"
    }
  ]);

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData, } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`),
    {
      enabled: !!user // Only run query if user data is available
    }
  );

  // --- Effect to Load Data ---
  useEffect(() => {
    if (resumeData) {
      setFormData(resumeData.formData || formData);
      setExperiences(resumeData.experiences || experiences);
      setSkills(resumeData.skills || skills);
      setEducation(resumeData.education || education);
      setReferences(resumeData.references || references);
    }
  }, [resumeData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
  };

  // Experience Handlers
  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index][name] = value;
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "New Job Title",
        company: "Company Name",
        dates: "Year - Year",
        description: "Enter description here.",
      },
    ]);
  };

  // Education Handlers
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);
  };

  const removeEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "New Degree",
        university: "University Name",
        dates: "Year - Year",
        description: "Enter description here (optional).",
      },
    ]);
  };

  // Skill Handlers
  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };

  const handleSkillLevelChange = (index, level) => {
    if (!isEdit) return; // Only allow changing level in edit mode
    const updatedSkills = [...skills];
    updatedSkills[index].level = level;
    setSkills(updatedSkills);
  }

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { name: "New Skill", level: 3 }]);
  };

  // Reference Handlers
  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReferences = [...references];
    updatedReferences[index][name] = value;
    setReferences(updatedReferences);
  };

  const removeReference = (index) => {
    const updatedReferences = [...references];
    updatedReferences.splice(index, 1);
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences([
      ...references,
      { name: "Reference Name", title: "Title, Company", phone: "Phone", email: "Email" },
    ]);
  };


  // --- Saving and Exporting ---
  const saveFormData = async () => {
    if (!user) {
      toast.error("You need to be logged in to save.");
      return;
    }
    const timeStamp = serverTimestamp();
    // Use a consistent ID format, perhaps combining template name and user ID
    const resume_id = `${templateName}-${user.uid}`;
    const imageUrl = await getImage(); // Get snapshot for preview

    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      education,
      experiences,
      skills,
      references,
      timeStamp,
      imageUrl,
    };

    console.log("Saving document:", _doc);
    setDoc(doc(db, "users", user.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
        if (refetch_resumeData) refetch_resumeData();
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
        console.error("Save Error:", err);
      });
  };

  const getImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.error("Unable to capture content. The DOM element is null.");
      return null;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element, { quality: 0.95 });
      return dataUrl;
    } catch (error) {
      toast.error("Oops, something went wrong while capturing image!");
      console.error("Image Capture Error:", error);
      return null;
    }
  };

  // PDF Generation
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

  // Image Generation (JPEG, PNG, SVG)
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

      switch (format) {
        case "png":
          dataUrl = await htmlToImage.toPng(element);
          break;
        case "svg":
          dataUrl = await htmlToImage.toSvg(element);
          break;
        case "jpeg":
        default:
          dataUrl = await htmlToImage.toJpeg(element, { quality: 0.95 });
          filename = `${formData.fullname}_Resume.jpg`; // Correct extension
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


  // --- RENDER ---
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 font-sans">
      <div className="w-full flex items-center gap-2 px-4">
        <Link to={"/"} className="flex items-center justify-center gap-2 text-txtPrimary"> <FaHouse /> Home </Link>
        <p className="text-txtPrimary cursor-pointer" onClick={() => navigate(-1)}> / {templateName} / </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] flex flex-col items-center justify-start px-4 md:px-8 lg:px-16">

        {/* Controls */}
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
            <p className="text-sm text-gray-600">Download:</p>
            <BsFiletypePdf
              className="text-xl text-red-500 hover:text-red-700 cursor-pointer"
              onClick={generatePDF}
              title="Download PDF"
            />
            <BsFiletypePng
              onClick={() => generateImage('png')}
              className="text-xl text-green-500 hover:text-green-700 cursor-pointer"
              title="Download PNG"
            />
            <BsFiletypeJpg
              className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer"
              onClick={() => generateImage('jpeg')}
              title="Download JPG"
            />
            <BsFiletypeSvg
              onClick={() => generateImage('svg')}
              className="text-xl text-purple-500 hover:text-purple-700 cursor-pointer"
              title="Download SVG"
            />
          </div>
        </div>

        {/* Resume Template - A4 Aspect Ratio Approximation */}
        <div className="w-full max-w-4xl min-h-[1123px] bg-white shadow-lg text-gray-800 font-sans" ref={resumeRef} > {/* A4 height approx */}
          {/* Header */}
          <div className="p-6 md:p-10 border-b border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <input
                  type="text"
                  readOnly={!isEdit}
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={`text-3xl md:text-4xl font-semibold tracking-wider uppercase outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  readOnly={!isEdit}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`text-sm md:text-base font-light tracking-widest uppercase mt-1 outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                  placeholder="Your Title"
                />
              </div>
              <input
                type="text"
                readOnly={!isEdit}
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`text-xs md:text-sm text-gray-600 text-right outline-none border-none w-1/3 ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 min-h-[calc(1123px-120px)]"> {/* Adjust height calculation based on header */}
            {/* Left Column */}
            <div className="col-span-12 md:col-span-4 bg-gray-50 p-6 md:p-8 border-r border-gray-200">
              {/* About Me */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider mb-3 text-gray-700 border-b border-gray-300 pb-1">
                  <FaUser /> About Me
                </h3>
                <textarea
                  readOnly={!isEdit}
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  className={`w-full text-sm text-gray-600 leading-relaxed outline-none border-none resize-none ${isEdit ? 'bg-white p-2 rounded border border-gray-200' : 'bg-transparent'}`}
                  rows="14" // Adjust rows as needed
                  placeholder="Write a brief description about yourself..."
                  style={{ minHeight: '150px' }}
                />
              </div>

              {/* Contact */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider mb-3 text-gray-700 border-b border-gray-300 pb-1">
                  <FaPhoneAlt /> Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="mt-1 text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Address:</strong>
                      <input type="text" readOnly={!isEdit} name="address" value={formData.address} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="Your Address" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Mobile:</strong>
                      <input type="text" readOnly={!isEdit} name="mobile" value={formData.mobile} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="Mobile Phone" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Home:</strong>
                      <input type="text" readOnly={!isEdit} name="home" value={formData.home} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="Home Phone" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Email:</strong>
                      <input type="email" readOnly={!isEdit} name="email" value={formData.email} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Website:</strong>
                      <input type="text" readOnly={!isEdit} name="website" value={formData.website} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="yourwebsite.com" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSkype className="text-gray-600" />
                    <div>
                      <strong className="block text-xs text-gray-500">Skype:</strong>
                      <input type="text" readOnly={!isEdit} name="skype" value={formData.skype} onChange={handleChange} className={`w-full text-gray-700 outline-none border-none ${isEdit ? 'bg-white p-1 rounded border border-gray-200' : 'bg-transparent'}`} placeholder="Your Skype ID" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider mb-4 text-gray-700 border-b border-gray-300 pb-1">
                  <FaCogs /> Skills
                </h3>
                <AnimatePresence>
                  {skills.map((skill, index) => (
                    <motion.div key={index} {...opacityINOut(index)} className="mb-3 relative group">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="name"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, e)}
                          className={`text-sm font-medium outline-none border-none w-3/5 ${isEdit ? 'bg-white px-1 rounded border border-gray-200' : 'bg-transparent'}`}
                          placeholder="Skill Name"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <span
                              key={level}
                              className={`block w-3 h-3 rounded-full border border-gray-400 ${
skill.level >= level ? 'bg-gray-700' : 'bg-gray-300'
} ${isEdit ? 'cursor-pointer hover:bg-gray-500' : ''}`}
                              onClick={() => handleSkillLevelChange(index, level)}
                              title={isEdit ? `Set level to ${level}`: `Level ${skill.level}`}
                            ></span>
                          ))}
                        </div>
                        {isEdit && (
                          <motion.div
                            {...fadeInOutWithOpacity}
                            onClick={() => removeSkill(index)}
                            className="absolute right-[-20px] top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                            title="Remove Skill"
                          >
                            <FaTrash className="text-xs" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isEdit && (
                  <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-2">
                    <button onClick={addSkill} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <FaPlus /> Add Skill
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 md:col-span-8 bg-white p-6 md:p-8">
              {/* Experiences */}
              <div className="mb-10">
                <h3 className="flex items-center gap-2 text-xl font-semibold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                  <FaSuitcase /> Experiences
                </h3>
                <AnimatePresence>
                  {experiences.map((exp, index) => (
                    <motion.div key={index} {...opacityINOut(index)} className="mb-6 relative group border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="title"
                          value={exp.title}
                          onChange={(e) => handleExpChange(index, e)}
                          className={`text-base font-medium uppercase tracking-wide outline-none border-none w-full sm:w-auto ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="dates"
                          value={exp.dates}
                          onChange={(e) => handleExpChange(index, e)}
                          className={`text-xs text-gray-500 mt-1 sm:mt-0 text-left sm:text-right outline-none border-none w-full sm:w-auto ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                          placeholder="Dates (e.g., 2020 - Present)"
                        />
                      </div>
                      <input
                        type="text"
                        readOnly={!isEdit}
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleExpChange(index, e)}
                        className={`text-sm font-normal text-gray-700 mb-2 outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                        placeholder="Company Name"
                      />
                      <textarea
                        readOnly={!isEdit}
                        name="description"
                        value={exp.description}
                        onChange={(e) => handleExpChange(index, e)}
                        className={`w-full text-sm text-gray-600 leading-relaxed outline-none border-none resize-none ${isEdit ? 'bg-gray-100 p-2 rounded' : 'bg-transparent'}`}
                        rows="3" // Adjust as needed
                        placeholder="Describe your role and responsibilities..."
                        style={{ minHeight: '60px' }}
                      />
                      {isEdit && (
                        <motion.div
                          {...fadeInOutWithOpacity}
                          onClick={() => removeExperience(index)}
                          className="absolute right-0 top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                          title="Remove Experience"
                        >
                          <FaTrash className="text-sm" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isEdit && (
                  <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-4">
                    <button onClick={addExperience} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <FaPlus /> Add Experience
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Education */}
              <div className="mb-10">
                <h3 className="flex items-center gap-2 text-xl font-semibold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                  <FaGraduationCap /> Education
                </h3>
                <AnimatePresence>
                  {education.map((edu, index) => (
                    <motion.div key={index} {...opacityINOut(index)} className="mb-6 relative group border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          className={`text-base font-medium uppercase tracking-wide outline-none border-none w-full sm:w-auto ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                          placeholder="Degree / Certificate"
                        />
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="dates"
                          value={edu.dates}
                          onChange={(e) => handleEducationChange(index, e)}
                          className={`text-xs text-gray-500 mt-1 sm:mt-0 text-left sm:text-right outline-none border-none w-full sm:w-auto ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                          placeholder="Dates (e.g., 2016 - 2020)"
                        />
                      </div>
                      <input
                        type="text"
                        readOnly={!isEdit}
                        name="university"
                        value={edu.university}
                        onChange={(e) => handleEducationChange(index, e)}
                        className={`text-sm font-normal text-gray-700 mb-2 outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-2 py-1 rounded' : 'bg-transparent'}`}
                        placeholder="University / Institution Name"
                      />
                      <textarea
                        readOnly={!isEdit}
                        name="description"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, e)}
                        className={`w-full text-sm text-gray-600 leading-relaxed outline-none border-none resize-none ${isEdit ? 'bg-gray-100 p-2 rounded' : 'bg-transparent'}`}
                        rows="2" // Adjust as needed
                        placeholder="Optional: relevant coursework, thesis, honors..."
                        style={{ minHeight: '40px' }}
                      />
                      {isEdit && (
                        <motion.div
                          {...fadeInOutWithOpacity}
                          onClick={() => removeEducation(index)}
                          className="absolute right-0 top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                          title="Remove Education"
                        >
                          <FaTrash className="text-sm" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isEdit && (
                  <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-4">
                    <button onClick={addEducation} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <FaPlus /> Add Education
                    </button>
                  </motion.div>
                )}
              </div>

              {/* References */}
              <div>
                <h3 className="flex items-center gap-2 text-xl font-semibold uppercase tracking-wider mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                  <FaAddressBook /> Reference
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <AnimatePresence>
                    {references.map((ref, index) => (
                      <motion.div key={index} {...opacityINOut(index)} className="relative group">
                        <input
                          type="text"
                          readOnly={!isEdit} name="name" value={ref.name} onChange={(e) => handleReferenceChange(index, e)}
                          className={`text-sm font-semibold block mb-0.5 outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-1 rounded' : 'bg-transparent'}`}
                          placeholder="Reference Name"
                        />
                        <input
                          type="text"
                          readOnly={!isEdit} name="title" value={ref.title} onChange={(e) => handleReferenceChange(index, e)}
                          className={`text-xs text-gray-600 block mb-0.5 outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-1 rounded' : 'bg-transparent'}`}
                          placeholder="Title, Company"
                        />
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaPhoneAlt className="text-xs"/>
                          <input
                            type="text"
                            readOnly={!isEdit} name="phone" value={ref.phone} onChange={(e) => handleReferenceChange(index, e)}
                            className={`outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-1 rounded' : 'bg-transparent'}`}
                            placeholder="Phone Number"
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaEnvelope className="text-xs"/>
                          <input
                            type="email"
                            readOnly={!isEdit} name="email" value={ref.email} onChange={(e) => handleReferenceChange(index, e)}
                            className={`outline-none border-none w-full ${isEdit ? 'bg-gray-100 px-1 rounded' : 'bg-transparent'}`}
                            placeholder="Email Address"
                          />
                        </div>
                        {isEdit && (
                          <motion.div
                            {...fadeInOutWithOpacity}
                            onClick={() => removeReference(index)}
                            className="absolute right-0 top-0 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                            title="Remove Reference"
                          >
                            <FaTrash className="text-xs" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {isEdit && (
                  <motion.div {...fadeInOutWithOpacity} className="flex justify-center mt-4">
                    <button onClick={addReference} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm">
                      <FaPlus /> Add Reference
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;
