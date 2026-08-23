import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../../context/PortfolioContext';
import portfolioService from '../../../services/portfolioService';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

const AdminAbout = () => {
  const { refreshPortfolio } = useContext(PortfolioContext);

  const [isLoading, setIsLoading] = useState(true);
  const [aboutText, setAboutText] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    period: '',
    degree: '',
    institution: '',
    details: ''
  });

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
      setEducationList([...educationList, newItem]);
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
  };

  const removeEducation = (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
  };

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
      setCertificationsList([...certificationsList, newItem]);
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
  };

  const removeCertification = (index) => {
    const updated = certificationsList.filter((_, i) => i !== index);
    setCertificationsList(updated);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Edit About, Education & Certifications</h2>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* About Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6">Detailed Biography (My Story)</h3>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows="6"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all resize-y"
          placeholder="Tell your story..."
        ></textarea>
      </div>

      {/* Education Management Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6">Education</h3>
        
        {/* List current education */}
        <div className="space-y-4 mb-8">
          {educationList.length === 0 ? (
            <p className="text-neutral-500 italic">No education entries added yet.</p>
          ) : (
            educationList.map((edu, idx) => (
              <div key={idx} className="border border-neutral-800 bg-neutral-950 rounded-xl p-6 flex justify-between items-start group">
                <div>
                  <span className="text-sm font-medium text-primary-400 mb-1 block">{edu.period}</span>
                  <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                  <p className="text-neutral-400 text-sm mb-3">{edu.institution}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {edu.details && edu.details.map((detail, i) => (
                      <li key={i} className="text-sm text-neutral-300">{detail}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editEducation(idx)} className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeEducation(idx)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit form */}
        <div className="border border-primary-500/30 bg-primary-500/5 rounded-xl p-6">
          <h4 className="font-semibold text-primary-400 mb-4">
            {editingEduId !== null ? 'Edit Education Entry' : 'Add New Education'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Period (e.g. 2020 - 2024)</label>
              <input type="text" name="period" value={eduForm.period} onChange={handleEduChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Degree (e.g. BCA)</label>
              <input type="text" name="degree" value={eduForm.degree} onChange={handleEduChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Institution</label>
            <input type="text" name="institution" value={eduForm.institution} onChange={handleEduChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Details (One per line)</label>
            <textarea name="details" value={eduForm.details} onChange={handleEduChange} rows="3" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white resize-y" placeholder="Focused on computer science...&#10;Studied core subjects..."></textarea>
          </div>
          <div className="flex justify-end gap-2">
            {editingEduId !== null && (
              <button onClick={() => { setEditingEduId(null); setEduForm({ period: '', degree: '', institution: '', details: '' }); }} className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
            )}
            <button onClick={saveEducationItem} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-600">
              {editingEduId !== null ? 'Update Entry' : <><Plus size={16} /> Add Entry</>}
            </button>
          </div>
        </div>
      </div>

      {/* Certifications & Courses Management Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6">Courses & Certifications</h3>
        
        {/* List current certifications */}
        <div className="space-y-4 mb-8">
          {certificationsList.length === 0 ? (
            <p className="text-neutral-500 italic">No courses or certifications added yet.</p>
          ) : (
            certificationsList.map((cert, idx) => (
              <div key={idx} className="border border-neutral-800 bg-neutral-950 rounded-xl p-6 flex justify-between items-start group">
                <div>
                  <span className="text-sm font-medium text-primary-400 mb-1 block">{cert.period}</span>
                  <h4 className="text-lg font-bold text-white">{cert.title}</h4>
                  <p className="text-neutral-400 text-sm mb-3">{cert.issuer}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {cert.details && cert.details.map((detail, i) => (
                      <li key={i} className="text-sm text-neutral-300">{detail}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editCertification(idx)} className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeCertification(idx)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit form */}
        <div className="border border-primary-500/30 bg-primary-500/5 rounded-xl p-6">
          <h4 className="font-semibold text-primary-400 mb-4">
            {editingCertId !== null ? 'Edit Course/Certification' : 'Add New Course/Certification'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Period (e.g. Aug 2024)</label>
              <input type="text" name="period" value={certForm.period} onChange={handleCertChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Course Title</label>
              <input type="text" name="title" value={certForm.title} onChange={handleCertChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Issuer/Platform (e.g. Udemy, Coursera)</label>
            <input type="text" name="issuer" value={certForm.issuer} onChange={handleCertChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Details (One per line)</label>
            <textarea name="details" value={certForm.details} onChange={handleCertChange} rows="3" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white resize-y" placeholder="Completed with 98% score...&#10;Learned React & Node.js..."></textarea>
          </div>
          <div className="flex justify-end gap-2">
            {editingCertId !== null && (
              <button onClick={() => { setEditingCertId(null); setCertForm({ period: '', title: '', issuer: '', details: '' }); }} className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
            )}
            <button onClick={saveCertificationItem} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-600">
              {editingCertId !== null ? 'Update Entry' : <><Plus size={16} /> Add Entry</>}
            </button>
          </div>
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
