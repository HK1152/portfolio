import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../../context/PortfolioContext';
import portfolioService from '../../../services/portfolioService';
import { Trash2, Plus, Edit2, X, ChevronUp, ChevronDown } from 'lucide-react';

const AdminAbout = () => {
  const { refreshPortfolio } = useContext(PortfolioContext);

  const [isLoading, setIsLoading] = useState(true);
  const [aboutText, setAboutText] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    period: '',
    degree: '',
    institution: '',
    details: ''
  });

  const [showAddCert, setShowAddCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    period: '',
    title: '',
    issuer: '',
    details: ''
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await portfolioService.getAbout();
        if (data) {
          setAboutText(data.about || '');
          setEducationList(data.education || []);
          setCertificationsList(data.certifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Education Handlers
  const handleEduChange = (e) => {
    const { name, value } = e.target;
    setEduForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEducationItem = () => {
    if (!eduForm.degree || !eduForm.institution) return;
    const detailsArray = eduForm.details.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    const newItem = {
      period: eduForm.period,
      degree: eduForm.degree,
      institution: eduForm.institution,
      details: detailsArray
    };

    if (editingEduId !== null) {
      const updatedList = [...educationList];
      updatedList[editingEduId] = newItem;
      setEducationList(updatedList);
      setEditingEduId(null);
    } else {
      // Add to TOP of array so it appears at top in frontend & backend
      setEducationList([newItem, ...educationList]);
      setShowAddEdu(false);
    }
    setEduForm({ period: '', degree: '', institution: '', details: '' });
  };

  const editEducation = (index) => {
    const item = educationList[index];
    setEduForm({
      period: item.period || '',
      degree: item.degree || '',
      institution: item.institution || '',
      details: (item.details || []).join('\n')
    });
    setEditingEduId(index);
    setShowAddEdu(false);
  };

  const removeEducation = (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
    if (editingEduId === index) {
      setEditingEduId(null);
      setEduForm({ period: '', degree: '', institution: '', details: '' });
    }
  };

  const moveEduUp = (index) => {
    if (index === 0) return;
    const newList = [...educationList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setEducationList(newList);
  };

  const moveEduDown = (index) => {
    if (index === educationList.length - 1) return;
    const newList = [...educationList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setEducationList(newList);
  };

  // Certification Handlers
  const handleCertChange = (e) => {
    const { name, value } = e.target;
    setCertForm(prev => ({ ...prev, [name]: value }));
  };

  const saveCertificationItem = () => {
    if (!certForm.title || !certForm.issuer) return;
    const detailsArray = certForm.details.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    const newItem = {
      period: certForm.period,
      title: certForm.title,
      issuer: certForm.issuer,
      details: detailsArray
    };

    if (editingCertId !== null) {
      const updatedList = [...certificationsList];
      updatedList[editingCertId] = newItem;
      setCertificationsList(updatedList);
      setEditingCertId(null);
    } else {
      // Add to TOP of array so it appears at top in frontend & backend
      setCertificationsList([newItem, ...certificationsList]);
      setShowAddCert(false);
    }
    setCertForm({ period: '', title: '', issuer: '', details: '' });
  };

  const editCertification = (index) => {
    const item = certificationsList[index];
    setCertForm({
      period: item.period || '',
      title: item.title || '',
      issuer: item.issuer || '',
      details: (item.details || []).join('\n')
    });
    setEditingCertId(index);
    setShowAddCert(false);
  };

  const removeCertification = (index) => {
    const updated = certificationsList.filter((_, i) => i !== index);
    setCertificationsList(updated);
    if (editingCertId === index) {
      setEditingCertId(null);
      setCertForm({ period: '', title: '', issuer: '', details: '' });
    }
  };

  const moveCertUp = (index) => {
    if (index === 0) return;
    const newList = [...certificationsList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setCertificationsList(newList);
  };

  const moveCertDown = (index) => {
    if (index === certificationsList.length - 1) return;
    const newList = [...certificationsList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setCertificationsList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const aboutData = {
        about: aboutText,
        education: educationList,
        certifications: certificationsList
      };
      
      await portfolioService.updateAbout(aboutData);
      
      setMessage({ type: 'success', text: 'About, Education & Certifications updated successfully!' });
      await refreshPortfolio();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Edit About, Education & Certifications</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage your biography, educational background, and certificates.</p>
        </div>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* About Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-white">Detailed Biography (My Story)</h3>
        <p className="text-neutral-400 text-sm mb-4">Write a comprehensive overview of your background, journey, and passion.</p>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows="6"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all resize-y"
          placeholder="Tell your story..."
        ></textarea>
      </div>

      {/* Education Management Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Education</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-primary-400 border border-neutral-700">
              {educationList.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingEduId(null);
              setEduForm({ period: '', degree: '', institution: '', details: '' });
              setShowAddEdu(true);
            }}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 rounded-full text-sm font-medium transition-colors flex items-center gap-2 border border-primary-500/30"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {/* Top Add/Edit form for Education */}
        {(showAddEdu || editingEduId !== null) && (
          <div className="border border-primary-500/30 bg-primary-500/5 rounded-xl p-6 mb-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-primary-400 text-base">
                {editingEduId !== null ? `Edit Education Entry (#${editingEduId + 1})` : 'Add New Education (Will appear at Top)'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowAddEdu(false);
                  setEditingEduId(null);
                  setEduForm({ period: '', degree: '', institution: '', details: '' });
                }}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
                title="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Period (e.g. 2020 - 2024)</label>
                <input 
                  type="text" 
                  name="period" 
                  value={eduForm.period} 
                  onChange={handleEduChange} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                  placeholder="2020 - 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Degree / Course Name *</label>
                <input 
                  type="text" 
                  name="degree" 
                  value={eduForm.degree} 
                  onChange={handleEduChange} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                  placeholder="Bachelor of Computer Applications"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Institution / University *</label>
              <input 
                type="text" 
                name="institution" 
                value={eduForm.institution} 
                onChange={handleEduChange} 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                placeholder="Veer Narmad South Gujarat University"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Highlights / Details (One per line)</label>
              <textarea 
                name="details" 
                value={eduForm.details} 
                onChange={handleEduChange} 
                rows="3" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50 resize-y" 
                placeholder="Major in Web Technologies&#10;Graduated with First Class with Distinction"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => { 
                  setShowAddEdu(false); 
                  setEditingEduId(null); 
                  setEduForm({ period: '', degree: '', institution: '', details: '' }); 
                }} 
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                type="button"
                onClick={saveEducationItem} 
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20"
              >
                {editingEduId !== null ? 'Update Entry' : <><Plus size={16} /> Add to Top</>}
              </button>
            </div>
          </div>
        )}
        
        {/* List current education */}
        <div className="space-y-4">
          {educationList.length === 0 ? (
            <p className="text-neutral-500 italic text-center py-8 bg-neutral-950 rounded-xl border border-neutral-800 border-dashed">
              No education entries added yet. Click "+ Add Entry" on the top right to get started.
            </p>
          ) : (
            educationList.map((edu, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-5 relative transition-all bg-neutral-950 ${
                  editingEduId === idx ? 'border-primary-500/50 ring-1 ring-primary-500/30' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full border border-primary-500/20">
                        {edu.period || 'No Period'}
                      </span>
                      <span className="text-xs text-neutral-500">#{idx + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{edu.degree}</h4>
                    <p className="text-neutral-400 text-sm font-medium">{edu.institution}</p>
                    {edu.details && edu.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-2">
                        {edu.details.map((detail, i) => (
                          <li key={i} className="text-sm text-neutral-300">{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Ordering & Action controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start bg-neutral-900/90 border border-neutral-800 p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => moveEduUp(idx)} 
                      disabled={idx === 0}
                      className="p-1.5 text-neutral-400 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors rounded hover:bg-neutral-800"
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveEduDown(idx)} 
                      disabled={idx === educationList.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors rounded hover:bg-neutral-800"
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-neutral-800 mx-0.5"></div>
                    <button 
                      type="button"
                      onClick={() => editEducation(idx)} 
                      className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded hover:bg-neutral-800"
                      title="Edit Entry"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeEducation(idx)} 
                      className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certifications & Courses Management Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Courses & Certifications</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-primary-400 border border-neutral-700">
              {certificationsList.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingCertId(null);
              setCertForm({ period: '', title: '', issuer: '', details: '' });
              setShowAddCert(true);
            }}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 rounded-full text-sm font-medium transition-colors flex items-center gap-2 border border-primary-500/30"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {/* Top Add/Edit form for Certifications */}
        {(showAddCert || editingCertId !== null) && (
          <div className="border border-primary-500/30 bg-primary-500/5 rounded-xl p-6 mb-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-primary-400 text-base">
                {editingCertId !== null ? `Edit Course/Certification (#${editingCertId + 1})` : 'Add New Course/Certification (Will appear at Top)'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowAddCert(false);
                  setEditingCertId(null);
                  setCertForm({ period: '', title: '', issuer: '', details: '' });
                }}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
                title="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Period (e.g. Aug 2024)</label>
                <input 
                  type="text" 
                  name="period" 
                  value={certForm.period} 
                  onChange={handleCertChange} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                  placeholder="Aug 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Course / Certificate Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={certForm.title} 
                  onChange={handleCertChange} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                  placeholder="Full Stack Web Development Bootcamp"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Issuer / Platform (e.g. Udemy, Coursera) *</label>
              <input 
                type="text" 
                name="issuer" 
                value={certForm.issuer} 
                onChange={handleCertChange} 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50" 
                placeholder="Udemy / Meta"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Details / Skills Learned (One per line)</label>
              <textarea 
                name="details" 
                value={certForm.details} 
                onChange={handleCertChange} 
                rows="3" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500/50 resize-y" 
                placeholder="React, Node.js, Express, MongoDB&#10;Completed capstone project"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => { 
                  setShowAddCert(false); 
                  setEditingCertId(null); 
                  setCertForm({ period: '', title: '', issuer: '', details: '' }); 
                }} 
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                type="button"
                onClick={saveCertificationItem} 
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20"
              >
                {editingCertId !== null ? 'Update Entry' : <><Plus size={16} /> Add to Top</>}
              </button>
            </div>
          </div>
        )}
        
        {/* List current certifications */}
        <div className="space-y-4">
          {certificationsList.length === 0 ? (
            <p className="text-neutral-500 italic text-center py-8 bg-neutral-950 rounded-xl border border-neutral-800 border-dashed">
              No courses or certifications added yet. Click "+ Add Entry" on the top right to get started.
            </p>
          ) : (
            certificationsList.map((cert, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-5 relative transition-all bg-neutral-950 ${
                  editingCertId === idx ? 'border-primary-500/50 ring-1 ring-primary-500/30' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full border border-primary-500/20">
                        {cert.period || 'No Period'}
                      </span>
                      <span className="text-xs text-neutral-500">#{idx + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{cert.title}</h4>
                    <p className="text-neutral-400 text-sm font-medium">{cert.issuer}</p>
                    {cert.details && cert.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-2">
                        {cert.details.map((detail, i) => (
                          <li key={i} className="text-sm text-neutral-300">{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Ordering & Action controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start bg-neutral-900/90 border border-neutral-800 p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => moveCertUp(idx)} 
                      disabled={idx === 0}
                      className="p-1.5 text-neutral-400 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors rounded hover:bg-neutral-800"
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveCertDown(idx)} 
                      disabled={idx === certificationsList.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors rounded hover:bg-neutral-800"
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-neutral-800 mx-0.5"></div>
                    <button 
                      type="button"
                      onClick={() => editCertification(idx)} 
                      className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded hover:bg-neutral-800"
                      title="Edit Entry"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeCertification(idx)} 
                      className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 sticky bottom-6 z-10">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/20 text-white rounded-full font-medium transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminAbout;
