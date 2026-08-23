import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { availableTechIcons, getIconComponent } from '../../../utils/techIcons';
import { Loader2, Plus, Trash2, Search, X } from 'lucide-react';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [techLogos, setTechLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [apiIcons, setApiIcons] = useState([]);
  const [isSearchingIcons, setIsSearchingIcons] = useState(false);
  const [iconSearchError, setIconSearchError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!iconSearch.trim()) {
      setApiIcons([]);
      setIconSearchError('');
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingIcons(true);
      setIconSearchError('');
      try {
        const query = encodeURIComponent(iconSearch.trim());
        const res = await fetch(`https://api.iconify.design/search?query=${query}&prefixes=simple-icons,cib,fa-brands,bxl,mdi&limit=100`);
        
        if (!res.ok) {
          throw new Error(`API returned status: ${res.status}`);
        }
        
        const data = await res.json();
        
        const uniqueIcons = [];
        const seenBases = new Set();
        
        if (data.icons) {
          for (const iconId of data.icons) {
            const base = iconId.split(':')[1];
            if (!seenBases.has(base)) {
              seenBases.add(base);
              uniqueIcons.push({
                id: iconId,
                name: base.charAt(0).toUpperCase() + base.slice(1).replace(/-/g, ' ')
              });
            }
          }
        }
        setApiIcons(uniqueIcons);
      } catch (err) {
        console.error('Failed to fetch icons:', err);
        setIconSearchError(err.message || 'Network error while fetching icons');
      } finally {
        setIsSearchingIcons(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [iconSearch]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/portfolio/skills');
      const data = response.data || {};
      
      const fetchedSkills = data.skills || [];
      let fetchedLogos = data.techLogos || [];
      
      // If no logos exist in DB, pre-fill with the defaults so user can read/delete them
      if (fetchedLogos.length === 0) {
        fetchedLogos = [
          { iconName: 'SiReact', title: 'React.js' },
          { iconName: 'SiHtml5', title: 'HTML5' },
          { iconName: 'SiCss', title: 'CSS3' },
          { iconName: 'SiJavascript', title: 'JavaScript' },
          { iconName: 'SiTailwindcss', title: 'Tailwind CSS' },
          { iconName: 'SiBootstrap', title: 'Bootstrap' },
          { iconName: 'SiNodedotjs', title: 'Node.js' },
          { iconName: 'SiExpress', title: 'Express.js' },
          { iconName: 'SiMongodb', title: 'MongoDB' },
          { iconName: 'SiGithub', title: 'GitHub' },
          { iconName: 'TbBrandAdobePhotoshop', title: 'Photoshop' },
          { iconName: 'SiN8N', title: 'n8n' },
          { iconName: 'SiC', title: 'C' },
          { iconName: 'SiCplusplus', title: 'C++' },
          { iconName: 'SiPostman', title: 'Postman' },
          { iconName: 'SiNetlify', title: 'Netlify' }
        ];
      }

      setSkills(fetchedSkills);
      setTechLogos(fetchedLogos);
    } catch (err) {
      setError('Failed to fetch skills data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      await apiClient.post('/portfolio/skills', { skills, techLogos });
      setSuccess('Skills data updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save skills data');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Skills Handlers ---
  const addCategory = () => {
    setSkills([...skills, { category: '', items: [] }]);
  };

  const removeCategory = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index, val) => {
    const newSkills = [...skills];
    newSkills[index].category = val;
    setSkills(newSkills);
  };

  const addItemToCategory = (index) => {
    const newSkills = [...skills];
    newSkills[index].items.push('');
    setSkills(newSkills);
  };

  const updateItem = (catIndex, itemIndex, val) => {
    const newSkills = [...skills];
    newSkills[catIndex].items[itemIndex] = val;
    setSkills(newSkills);
  };

  const removeItemFromCategory = (catIndex, itemIndex) => {
    const newSkills = [...skills];
    newSkills[catIndex].items = newSkills[catIndex].items.filter((_, i) => i !== itemIndex);
    setSkills(newSkills);
  };

  // --- Tech Logos Handlers ---
  const removeLogo = (index) => {
    setTechLogos(techLogos.filter((_, i) => i !== index));
  };

  const addLogo = (iconObj) => {
    // avoid duplicates by ID
    if (!techLogos.some(l => l.iconName === iconObj.id)) {
      setTechLogos([...techLogos, { iconName: iconObj.id, title: iconObj.name }]);
    }
    setShowIconPicker(false);
    setIconSearch('');
  };

  const displayIcons = iconSearch.trim() 
    ? (apiIcons.length > 0 
        ? apiIcons 
        : availableTechIcons.filter(icon => 
            icon.name.toLowerCase().includes(iconSearch.toLowerCase()) || 
            icon.id.toLowerCase().includes(iconSearch.toLowerCase())
          )
      )
    : availableTechIcons;

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Manage Skills</h2>
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

      {/* --- Marquee Tech Logos Section --- */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Tech Logos (Marquee)</h3>
            <p className="text-sm text-neutral-400">Manage the scrolling icons displayed in the hero/skills section.</p>
          </div>
          <button
            onClick={() => setShowIconPicker(true)}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium hover:bg-primary-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Logo
          </button>
        </div>

        {techLogos.length === 0 ? (
          <p className="text-neutral-500 text-sm italic">No logos added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {techLogos.map((logo, index) => {
              const Icon = getIconComponent(logo.iconName);
              return (
                <div key={index} className="flex flex-col items-center gap-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl relative group">
                  <button 
                    onClick={() => removeLogo(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {Icon ? <Icon className="text-3xl text-primary-500" /> : <div className="w-8 h-8 bg-neutral-800 rounded-full" />}
                  <span className="text-xs text-neutral-400">{logo.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Skill Categories Section --- */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Skill Categories</h3>
            <p className="text-sm text-neutral-400">Group your skills by category (e.g., Frontend, Backend, Tools).</p>
          </div>
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium hover:bg-primary-500/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="space-y-6">
          {skills.length === 0 ? (
            <p className="text-neutral-500 text-sm italic text-center py-8 bg-neutral-950 rounded-xl border border-neutral-800 border-dashed">
              No skill categories defined. Click "Add Category" to get started.
            </p>
          ) : (
            skills.map((category, catIndex) => (
              <div key={catIndex} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 relative group">
                <button 
                  onClick={() => removeCategory(catIndex)}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-red-500 transition-colors"
                  title="Remove Category"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="mb-4 pr-12">
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={category.category}
                    onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                    placeholder="e.g. Frontend Development"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center bg-neutral-900 border border-neutral-700 rounded-full overflow-hidden">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateItem(catIndex, itemIndex, e.target.value)}
                          placeholder="Skill name"
                          className="bg-transparent px-3 py-1.5 text-sm text-white w-32 focus:outline-none"
                        />
                        <button 
                          onClick={() => removeItemFromCategory(catIndex, itemIndex)}
                          className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-800 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addItemToCategory(catIndex)}
                      className="px-3 py-1.5 bg-neutral-800 border border-dashed border-neutral-600 text-neutral-400 rounded-full text-sm hover:text-white hover:border-white transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Icon Picker Modal --- */}
      {showIconPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Select Tech Icon</h3>
              <button onClick={() => setShowIconPicker(false)} className="text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 border-b border-neutral-800">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                  type="text"
                  placeholder="Search 10,000+ icons (e.g. React, Node, AWS...)"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar min-h-[300px]">
              {iconSearchError ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                  <p className="font-medium">Error Fetching Icons</p>
                  <p className="text-sm opacity-80">{iconSearchError}</p>
                </div>
              ) : isSearchingIcons ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  <p>Searching global icon database...</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {displayIcons.map((iconObj) => {
                    const IconComponent = getIconComponent(iconObj.id);
                    const isSelected = techLogos.some(l => l.iconName === iconObj.id);
                    return (
                      <button
                        key={iconObj.id}
                        onClick={() => addLogo(iconObj)}
                        disabled={isSelected}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                          isSelected 
                            ? 'opacity-50 cursor-not-allowed bg-primary-500/10 border border-primary-500/20' 
                            : 'hover:bg-neutral-800 border border-transparent hover:border-neutral-700'
                        }`}
                      >
                        {IconComponent ? <IconComponent className={`text-2xl ${isSelected ? 'text-primary-500' : 'text-neutral-300'}`} /> : <div className="w-6 h-6 bg-neutral-800 rounded-full" />}
                        <span className="text-[10px] text-center text-neutral-400 truncate w-full">{iconObj.name}</span>
                      </button>
                    );
                  })}
                  {displayIcons.length === 0 && (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                      No icons found matching "{iconSearch}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
