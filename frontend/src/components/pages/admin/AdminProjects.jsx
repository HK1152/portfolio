import React, { useState, useEffect, useContext } from 'react';
import portfolioService from '../../../services/portfolioService';
import { PortfolioContext } from '../../../context/PortfolioContext';
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Upload } from 'lucide-react';
import { validateFileSecurity } from '../../../utils/security';

const DEFAULT_PROJECT_FALLBACK = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(null);
  const { refreshPortfolio } = useContext(PortfolioContext) || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioService.getProjects();
      setProjects(data?.projects || []);
    } catch (err) {
      setError('Failed to fetch projects data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      await portfolioService.updateProjects({ projects });
      if (typeof refreshPortfolio === 'function') {
        await refreshPortfolio();
      }
      setSuccess('Projects updated and saved successfully to database!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save projects');
    } finally {
      setIsSaving(false);
    }
  };

  const addProject = () => {
    setProjects([{ title: '', tech: '', description: '', liveDemo: '', githubLink: '', image: '' }, ...projects]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const moveProjectUp = (index) => {
    if (index === 0) return;
    const newProj = [...projects];
    [newProj[index - 1], newProj[index]] = [newProj[index], newProj[index - 1]];
    setProjects(newProj);
  };

  const moveProjectDown = (index) => {
    if (index === projects.length - 1) return;
    const newProj = [...projects];
    [newProj[index], newProj[index + 1]] = [newProj[index + 1], newProj[index]];
    setProjects(newProj);
  };

  const updateProject = (index, field, val) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[index] = { ...newProjects[index], [field]: val };
      return newProjects;
    });
  };

  const getPreviewUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http') || imgPath.startsWith('data:')) return imgPath;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
    return `${baseUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    const validation = validateFileSecurity(file, 10, [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'image/gif',
      'image/svg+xml'
    ]);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      setUploadingImage(index);
      setError('');
      
      const response = await portfolioService.uploadProjectImage(file);
      const rawUrl = response?.imageUrl || response?.data?.imageUrl || response?.data?.data?.imageUrl;

      if (rawUrl) {
        updateProject(index, 'image', rawUrl);
        setSuccess('Image uploaded! Click "Save Changes" to save it permanently in the database.');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        throw new Error('Failed to retrieve uploaded image path.');
      }
    } catch (err) {
      console.error('Project image upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Manage Projects</h2>
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
            <h3 className="text-xl font-bold text-white mb-1">Your Projects</h3>
            <p className="text-sm text-neutral-400">Showcase your latest work, case studies, and side projects.</p>
          </div>
          <button
            onClick={addProject}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium hover:bg-primary-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <div className="space-y-6">
          {projects.length === 0 ? (
            <p className="text-neutral-500 text-sm italic text-center py-8 bg-neutral-950 rounded-xl border border-neutral-800 border-dashed">
              No projects defined. Click "Add Project" to get started.
            </p>
          ) : (
            projects.map((proj, projIndex) => (
              <div key={projIndex} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 relative group">
                <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                  <button 
                    onClick={() => moveProjectUp(projIndex)}
                    disabled={projIndex === 0}
                    className="p-1.5 text-neutral-500 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors bg-neutral-900 rounded-md shadow-sm"
                    title="Move Up"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => moveProjectDown(projIndex)}
                    disabled={projIndex === projects.length - 1}
                    className="p-1.5 text-neutral-500 hover:text-primary-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors bg-neutral-900 rounded-md shadow-sm"
                    title="Move Down"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => removeProject(projIndex)}
                    className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors ml-2 bg-neutral-900 rounded-md shadow-sm border border-red-500/10"
                    title="Remove Project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column - Image Upload */}
                  <div className="lg:col-span-4 flex flex-col gap-2">
                    <label className="block text-sm font-medium text-neutral-400">Project Image (IMG)</label>
                    <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-900 hover:border-primary-500/50 transition-colors aspect-video flex items-center justify-center cursor-pointer">
                      {proj.image ? (
                        <img 
                          src={getPreviewUrl(proj.image)} 
                          alt={proj.title || 'Project'} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_PROJECT_FALLBACK;
                          }}
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                          <p className="text-xs text-neutral-500">Click to upload image</p>
                        </div>
                      )}
                      
                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Loading Overlay */}
                      {uploadingImage === projIndex && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary-500 mb-2" />
                          <span className="text-xs text-white">Uploading to Cloud...</span>
                        </div>
                      )}

                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => handleImageUpload(projIndex, e.target.files[0])}
                        disabled={uploadingImage === projIndex}
                      />
                    </div>
                    
                    <input
                      type="text"
                      value={proj.image || ''}
                      onChange={(e) => updateProject(projIndex, 'image', e.target.value)}
                      placeholder="Or enter direct image URL"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-primary-500 transition-colors mt-2"
                    />
                  </div>

                  {/* Right Column - Text Details */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(projIndex, 'title', e.target.value)}
                        placeholder="e.g. AI Story Automation"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) => updateProject(projIndex, 'tech', e.target.value)}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(projIndex, 'description', e.target.value)}
                        placeholder="Describe what the project does..."
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveDemo || ''}
                        onChange={(e) => updateProject(projIndex, 'liveDemo', e.target.value)}
                        placeholder="e.g. https://myproject.com"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">GitHub URL (Leave empty to make Private)</label>
                      <input
                        type="text"
                        value={proj.githubLink || ''}
                        onChange={(e) => updateProject(projIndex, 'githubLink', e.target.value)}
                        placeholder="e.g. https://github.com/username/repo"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
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

export default AdminProjects;
