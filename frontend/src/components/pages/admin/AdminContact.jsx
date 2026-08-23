import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../../context/PortfolioContext';
import portfolioService from '../../../services/portfolioService';

const AdminContact = () => {
  const { refreshPortfolio } = useContext(PortfolioContext);

  const [formData, setFormData] = useState({
    email: '',
    location: '',
    linkedin: '',
    github: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const data = await portfolioService.getContact();
        if (data) {
          setFormData({
            email: data.email || '',
            location: data.location || '',
            linkedin: data.linkedin || '',
            github: data.github || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await portfolioService.updateContact(formData);
      setMessage({ type: 'success', text: 'Contact info updated successfully!' });
      await refreshPortfolio();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update contact info' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="inline-flex p-3 bg-primary-500/10 rounded-full">
          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Contact Info</h2>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <p className="text-neutral-400 mb-6">
          Manage your email, phone, and location displayed in the contact section.
        </p>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="E.g. Gandhinagar, India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedin"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                GitHub Profile URL
              </label>
              <input
                type="url"
                name="github"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
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
      </div>
    </div>
  );
};

export default AdminContact;
