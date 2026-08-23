import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { Loader2, Plus, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';

const AdminExperience = () => {
  const [experience, setExperience] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/portfolio/experience');
      const data = response.data || {};
      setExperience(data.experience || []);
    } catch (err) {
      setError('Failed to fetch experience data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      await apiClient.post('/portfolio/experience', { experience });
      setSuccess('Experience data updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save experience data');
    } finally {
      setIsSaving(false);
    }
  };

  const addExperience = () => {
    setExperience([{ period: '', role: '', company: '', details: [] }, ...experience]);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const moveExperienceUp = (index) => {
    if (index === 0) return;
    const newExp = [...experience];
    [newExp[index - 1], newExp[index]] = [newExp[index], newExp[index - 1]];
    setExperience(newExp);
  };

  const moveExperienceDown = (index) => {
    if (index === experience.length - 1) return;
    const newExp = [...experience];
    [newExp[index], newExp[index + 1]] = [newExp[index + 1], newExp[index]];
    setExperience(newExp);
  };

  const updateExperience = (index, field, val) => {
    const newExperience = [...experience];
    newExperience[index][field] = val;
    setExperience(newExperience);
  };

  const addDetailToExperience = (expIndex) => {
    const newExperience = [...experience];
    newExperience[expIndex].details.push('');
    setExperience(newExperience);
  };

  const updateDetail = (expIndex, detailIndex, val) => {
    const newExperience = [...experience];
    newExperience[expIndex].details[detailIndex] = val;
    setExperience(newExperience);
  };

  const removeDetailFromExperience = (expIndex, detailIndex) => {
    const newExperience = [...experience];
    newExperience[expIndex].details = newExperience[expIndex].details.filter((_, i) => i !== detailIndex);
    setExperience(newExperience);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Manage Experience</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary-500 text-neutral-950 font-medium rounded-xl hover:bg-primary-400 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">{error}</div>}
      {success && <div className="p-4 bg-primary-500/10 text-primary-500 rounded-xl border border-primary-500/20">{success}</div>}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Work Experience</h3>
            <p className="text-sm text-neutral-400">Add or edit your past internships and work experience.</p>
          </div>
          <button
            onClick={addExperience}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium hover:bg-primary-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>

        <div className="space-y-6">
          {experience.length === 0 ? (
            <p className="text-neutral-500 text-sm italic text-center py-8 bg-neutral-950 rounded-xl border border-neutral-800 border-dashed">
              No experience defined. Click "Add Experience" to get started.
            </p>
          ) : (
            experience.map((exp, expIndex) => (
              <div key={expIndex} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 relative group">
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button 
                    onClick={() => moveExperienceUp(expIndex)}
                    disabled={expIndex === 0}
                    className="p-1.5 text-neutral-500 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => moveExperienceDown(expIndex)}
                    disabled={expIndex === experience.length - 1}
                    className="p-1.5 text-neutral-500 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => removeExperience(expIndex)}
                    className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors ml-2"
                    title="Remove Experience"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-32">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Role/Position</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(expIndex, 'role', e.target.value)}
                      placeholder="e.g. Web Development Intern"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      placeholder="e.g. Skillairo EduTech Pvt. Ltd."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(expIndex, 'period', e.target.value)}
                      placeholder="e.g. Dec 2025 - Feb 2026"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Details / Responsibilities</label>
                  <div className="space-y-3">
                    {exp.details && exp.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateDetail(expIndex, detailIndex, e.target.value)}
                          placeholder="What did you do?"
                          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                        <button 
                          onClick={() => removeDetailFromExperience(expIndex, detailIndex)}
                          className="p-2 text-neutral-500 hover:text-red-500 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-red-500/50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addDetailToExperience(expIndex)}
                      className="px-3 py-1.5 bg-neutral-800 border border-dashed border-neutral-600 text-neutral-400 rounded-full text-sm hover:text-white hover:border-white transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Responsibility
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExperience;
