import React, { useContext, useState, useEffect, useRef } from 'react';
import { PortfolioContext } from '../../../context/PortfolioContext';
import portfolioService from '../../../services/portfolioService';
import { validateFileSecurity } from '../../../utils/security';

const AdminHome = () => {
  const { cvData, refreshPortfolio } = useContext(PortfolioContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    heroDescription: '',
    email: '',
    linkedin: '',
    github: '',
    cvUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await portfolioService.getDashboard();
        if (data) {
          setFormData({
            name: data.name || '',
            title: data.title || '',
            heroDescription: data.heroDescription || '',
            email: data.email || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            cvUrl: data.cvUrl || '/kavya_cv.pdf'
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validation = validateFileSecurity(file, 10, ['application/pdf', 'application/x-pdf']);
      if (!validation.isValid) {
        setMessage({ type: 'error', text: validation.error });
        return;
      }

      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      let finalCvUrl = formData.cvUrl;

      if (selectedFile) {
        const uploadRes = await portfolioService.uploadCV(selectedFile);
        if (uploadRes && uploadRes.cvUrl) {
          finalCvUrl = uploadRes.cvUrl;
        } else if (uploadRes && uploadRes.data && uploadRes.data.cvUrl) {
          finalCvUrl = uploadRes.data.cvUrl;
        } else {
          throw new Error('Failed to retrieve uploaded CV URL');
        }
      }

      const dashboardData = {
        name: formData.name,
        title: formData.title,
        heroDescription: formData.heroDescription,
        email: formData.email,
        linkedin: formData.linkedin,
        github: formData.github,
        cvUrl: finalCvUrl
      };
      
      await portfolioService.updateDashboard(dashboardData);
      
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
      await refreshPortfolio();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Projects</h3>
          <div className="text-4xl font-black text-primary-500">{cvData?.projects?.length || 0}</div>
          <p className="text-neutral-400 mt-2 text-sm">Total projects in portfolio</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Experience</h3>
          <div className="text-4xl font-black text-primary-500">{cvData?.experience?.length || 0}</div>
          <p className="text-neutral-400 mt-2 text-sm">Total roles added</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Skills</h3>
          <div className="text-4xl font-black text-primary-500">{cvData?.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0}</div>
          <p className="text-neutral-400 mt-2 text-sm">Total skills listed</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Edit Hero Section</h2>
        </div>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="E.g. Kavya Patel"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Main Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="E.g. Full Stack Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Hero Subtitle / Description
            </label>
            <textarea
              name="heroDescription"
              value={formData.heroDescription}
              onChange={handleInputChange}
              rows="4"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all resize-y"
              placeholder="Enter a brief description for the hero section..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="Your email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="linkedin.com/in/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                GitHub URL
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="github.com/username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Upload New Resume/CV (PDF)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="file"
                name="cvFile"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-neutral-400
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-500/10 file:text-primary-400
                  hover:file:bg-primary-500/20 file:transition-colors file:cursor-pointer"
              />
              {formData.cvUrl && !selectedFile && (
                <div className="text-sm text-neutral-500 flex-shrink-0">
                  Current: <span className="text-primary-400 truncate max-w-[200px] inline-block align-bottom">{formData.cvUrl.split('/').pop()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
