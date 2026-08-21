import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { PortfolioContext } from '../context/PortfolioContext';
import { cvData as localCvData } from '../data/cvData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const EMPTY_DATA = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
    about: '',
    myStory: '',
    cvUrl: ''
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  extraActivities: [],
  socialLinks: [],
};

const jsonFields = [
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'extraActivities', label: 'Extra Activities' },
];

const formatJson = (value) => JSON.stringify(value ?? [], null, 2);

function AdminField({ label, value, onChange, multiline = false }) {
  const inputClass = 'w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400';

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-300">{label}</span>
      {multiline ? (
        <textarea className={`${inputClass} min-h-32 resize-y`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function JsonEditor({ label, value, onChange }) {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-semibold text-neutral-300">{label} (JSON Array)</span>
      <textarea
        value={value}
        onChange={handleChange}
        className="h-96 w-full rounded-xl border border-neutral-700 bg-neutral-950 p-4 font-mono text-sm text-emerald-400 outline-none transition focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(52,211,153,0.1)]"
        spellCheck="false"
      />
    </label>
  );
}

function EducationEditor({ education, onChange }) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [period, setPeriod] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [detailsText, setDetailsText] = useState('');

  // When editingIndex changes, load values
  useEffect(() => {
    if (editingIndex >= 0 && education[editingIndex]) {
      const item = education[editingIndex];
      setPeriod(item.period || '');
      setDegree(item.degree || '');
      setInstitution(item.institution || '');
      setDetailsText((item.details || []).join('\n'));
    } else {
      setPeriod('');
      setDegree('');
      setInstitution('');
      setDetailsText('');
    }
  }, [editingIndex, education]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!period || !degree || !institution) {
      alert('Period, Degree, and Institution are required');
      return;
    }

    const details = detailsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const newEntry = {
      id: editingIndex >= 0 && education[editingIndex]?.id ? education[editingIndex].id : Date.now(),
      period,
      degree,
      institution,
      details,
    };

    const updated = [...education];
    if (editingIndex >= 0) {
      updated[editingIndex] = newEntry;
    } else {
      updated.push(newEntry);
    }

    onChange(updated);
    setEditingIndex(-1);
    setPeriod('');
    setDegree('');
    setInstitution('');
    setDetailsText('');
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setPeriod('');
    setDegree('');
    setInstitution('');
    setDetailsText('');
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      const updated = education.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index === education.length - 1) return;
    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">
          {editingIndex >= 0 ? 'Edit Education Entry' : 'Add New Education Entry'}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Period</label>
              <input
                type="text"
                placeholder="e.g. 2023 - 2026"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Degree / Program</label>
              <input
                type="text"
                placeholder="e.g. Bachelor's Program"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Institution</label>
              <input
                type="text"
                placeholder="e.g. B P College of Computer Studies"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">
              Details / Description (One point per line)
            </label>
            <textarea
              placeholder="Focused on computer science fundamentals...&#10;IEEE Member..."
              rows={4}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400 font-sans"
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-neutral-950 hover:bg-emerald-400 transition"
            >
              {editingIndex >= 0 ? 'Update Entry' : 'Add Entry'}
            </button>
            {editingIndex >= 0 && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl bg-neutral-700 px-6 py-2.5 text-white hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-200 border-t border-neutral-800 pt-6">
          Education List
        </h3>
        {education.length === 0 ? (
          <p className="text-neutral-500">No education entries added yet.</p>
        ) : (
          <div className="space-y-4">
            {education.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      {item.period}
                    </span>
                    <span className="text-neutral-400">|</span>
                    <h4 className="font-bold text-white text-lg">{item.degree}</h4>
                  </div>
                  <p className="text-neutral-300 font-medium">{item.institution}</p>
                  {item.details && item.details.length > 0 && (
                    <ul className="list-disc list-inside text-neutral-400 text-sm mt-2 space-y-1 pl-1">
                      {item.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="flex gap-1 border-r border-neutral-800 pr-3 mr-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === education.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(idx)}
                    className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 text-sm font-semibold text-blue-400 transition border border-blue-500/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-sm font-semibold text-red-400 transition border border-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceEditor({ experience, onChange }) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [period, setPeriod] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [detailsText, setDetailsText] = useState('');
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  useEffect(() => {
    if (editingIndex >= 0 && experience[editingIndex]) {
      const item = experience[editingIndex];
      setPeriod(item.period || '');
      setRole(item.role || '');
      setCompany(item.company || '');
      setDetailsText((item.details || []).join('\n'));
      setIsCurrentlyWorking(item.isCurrentlyWorking || false);
    } else {
      setPeriod('');
      setRole('');
      setCompany('');
      setDetailsText('');
      setIsCurrentlyWorking(false);
    }
  }, [editingIndex, experience]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!period || !role || !company) {
      alert('Period, role, and company are required');
      return;
    }

    const details = detailsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const newEntry = {
      id: editingIndex >= 0 && experience[editingIndex]?.id ? experience[editingIndex].id : Date.now(),
      period,
      role,
      company,
      details,
      isCurrentlyWorking,
    };

    const updated = [...experience];
    if (editingIndex >= 0) {
      updated[editingIndex] = newEntry;
    } else {
      updated.push(newEntry);
    }

    onChange(updated);
    setEditingIndex(-1);
    setPeriod('');
    setRole('');
    setCompany('');
    setDetailsText('');
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setPeriod('');
    setRole('');
    setCompany('');
    setDetailsText('');
    setIsCurrentlyWorking(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      onChange(experience.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...experience];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index === experience.length - 1) return;
    const updated = [...experience];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">{editingIndex >= 0 ? 'Edit Experience Entry' : 'Add New Experience Entry'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Period</label>
              <input
                type="text"
                placeholder="e.g. Dec 2025 - Feb 2026"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Role</label>
              <input
                type="text"
                placeholder="e.g. Web Developer"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Company</label>
              <input
                type="text"
                placeholder="e.g. Company Name"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Details / Achievements (one line each)</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400 font-sans"
              placeholder="Built feature X...&#10;Improved performance..."
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrentlyWorking}
                onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
                className="w-5 h-5 rounded border border-neutral-700 bg-neutral-950 cursor-pointer accent-emerald-400"
              />
              <span className="text-sm font-semibold text-neutral-300">Currently Working Here</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-neutral-950 hover:bg-emerald-400 transition">{editingIndex >= 0 ? 'Update Entry' : 'Add Entry'}</button>
            {editingIndex >= 0 && (
              <button type="button" onClick={handleCancel} className="rounded-xl bg-neutral-700 px-6 py-2.5 text-white hover:bg-neutral-600 transition">Cancel</button>
            )}
          </div>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-200 border-t border-neutral-800 pt-6">Experience List</h3>
        {experience.length === 0 ? (
          <p className="text-neutral-500">No experience entries added yet.</p>
        ) : (
          <div className="space-y-4">
            {experience.map((item, idx) => (
              <div key={item.id || idx} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{item.period}</span>
                    <span className="text-neutral-400">|</span>
                    <h4 className="font-bold text-white text-lg">{item.role}</h4>
                    {item.isCurrentlyWorking && (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">PRESENT</span>
                    )}
                  </div>
                  <p className="text-neutral-300 font-medium">{item.company}</p>
                  {item.details && item.details.length > 0 && (
                    <ul className="list-disc list-inside text-neutral-400 text-sm mt-2 space-y-1 pl-1">
                      {item.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="flex gap-1 border-r border-neutral-800 pr-3 mr-1">
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Up">▲</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === experience.length - 1} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Down">▼</button>
                  </div>
                  <button type="button" onClick={() => setEditingIndex(idx)} className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 text-sm font-semibold text-blue-400 transition border border-blue-500/20">Edit</button>
                  <button type="button" onClick={() => handleDelete(idx)} className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-sm font-semibold text-red-400 transition border border-red-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsEditor({ skills, onChange }) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [category, setCategory] = useState('');
  const [itemsText, setItemsText] = useState('');

  useEffect(() => {
    if (editingIndex >= 0 && skills[editingIndex]) {
      const item = skills[editingIndex];
      setCategory(item.category || '');
      setItemsText((item.items || []).join('\n'));
    } else {
      setCategory('');
      setItemsText('');
    }
  }, [editingIndex, skills]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!category) {
      alert('Category is required');
      return;
    }

    const items = itemsText
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    const newEntry = {
      id: editingIndex >= 0 && skills[editingIndex]?.id ? skills[editingIndex].id : Date.now(),
      category,
      items,
    };

    const updated = [...skills];
    if (editingIndex >= 0) {
      updated[editingIndex] = newEntry;
    } else {
      updated.push(newEntry);
    }

    onChange(updated);
    setEditingIndex(-1);
    setCategory('');
    setItemsText('');
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setCategory('');
    setItemsText('');
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this skills entry?')) {
      onChange(skills.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...skills];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index === skills.length - 1) return;
    const updated = [...skills];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">{editingIndex >= 0 ? 'Edit Skill Group' : 'Add New Skill Group'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Category</label>
              <input
                type="text"
                placeholder="e.g. Frontend"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Items (one per line)</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400 font-sans"
                placeholder="HTML\nCSS\nReact"
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-neutral-950 hover:bg-emerald-400 transition">{editingIndex >= 0 ? 'Update Entry' : 'Add Entry'}</button>
            {editingIndex >= 0 && (
              <button type="button" onClick={handleCancel} className="rounded-xl bg-neutral-700 px-6 py-2.5 text-white hover:bg-neutral-600 transition">Cancel</button>
            )}
          </div>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-200 border-t border-neutral-800 pt-6">Skills List</h3>
        {skills.length === 0 ? (
          <p className="text-neutral-500">No skills entries added yet.</p>
        ) : (
          <div className="space-y-4">
            {skills.map((item, idx) => (
              <div key={item.id || idx} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{item.category}</span>
                  </div>
                  {item.items && item.items.length > 0 && (
                    <ul className="list-disc list-inside text-neutral-400 text-sm mt-2 space-y-1 pl-1">
                      {item.items.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="flex gap-1 border-r border-neutral-800 pr-3 mr-1">
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Up">▲</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === skills.length - 1} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Down">▼</button>
                  </div>
                  <button type="button" onClick={() => setEditingIndex(idx)} className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 text-sm font-semibold text-blue-400 transition border border-blue-500/20">Edit</button>
                  <button type="button" onClick={() => handleDelete(idx)} className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-sm font-semibold text-red-400 transition border border-red-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsEditor({ projects, onChange, onImageUpload, uploadingImage, adminKey, apiUrl }) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [techText, setTechText] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');

  useEffect(() => {
    if (editingIndex >= 0 && projects[editingIndex]) {
      const item = projects[editingIndex];
      setTitle(item.title || '');
      setDescription(item.description || '');
      setImage(item.image || '');
      setTechText((item.technologies || []).join(', '));
      setLiveLink(item.liveLink || '');
      setGithubLink(item.githubLink || '');
    } else {
      setTitle('');
      setDescription('');
      setImage('');
      setTechText('');
      setLiveLink('');
      setGithubLink('');
    }
  }, [editingIndex, projects]);

  const handleImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      const uploadedUrl = await onImageUpload(file);
      if (uploadedUrl) {
        setImage(uploadedUrl);
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !description || !techText) {
      alert('Title, description, and technologies are required');
      return;
    }

    const technologies = techText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newEntry = {
      id: editingIndex >= 0 && projects[editingIndex]?.id ? projects[editingIndex].id : Date.now(),
      title,
      description,
      image,
      technologies,
      liveLink: liveLink.trim() || null,
      githubLink: githubLink.trim() || null,
    };

    const updated = [...projects];
    if (editingIndex >= 0) {
      updated[editingIndex] = newEntry;
    } else {
      updated.push(newEntry);
    }

    onChange(updated);
    setEditingIndex(-1);
    setTitle('');
    setDescription('');
    setImage('');
    setTechText('');
    setLiveLink('');
    setGithubLink('');
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setTitle('');
    setDescription('');
    setImage('');
    setTechText('');
    setLiveLink('');
    setGithubLink('');
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this project entry?')) {
      onChange(projects.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...projects];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index === projects.length - 1) return;
    const updated = [...projects];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">{editingIndex >= 0 ? 'Edit Project Entry' : 'Add New Project Entry'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Project Title</label>
              <input
                type="text"
                placeholder="e.g. AI Story-to-YouTube Automation"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Project Image</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={handleImageFileSelect} className="hidden" id="project-image-upload" />
                <label htmlFor="project-image-upload" className="cursor-pointer rounded-xl bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition">
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {image && (
                  <span className="text-sm text-emerald-400 truncate">✓ Image set</span>
                )}
              </div>
            </div>
          </div>
          {image && (
            <div className="border border-neutral-700 rounded-xl p-3 bg-neutral-900">
              <img src={image} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed description of your project..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400 font-sans"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB, Express"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              value={techText}
              onChange={(e) => setTechText(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">Live Demo Link</label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">GitHub Link</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-neutral-950 hover:bg-emerald-400 transition">{editingIndex >= 0 ? 'Update Project' : 'Add Project'}</button>
            {editingIndex >= 0 && (
              <button type="button" onClick={handleCancel} className="rounded-xl bg-neutral-700 px-6 py-2.5 text-white hover:bg-neutral-600 transition">Cancel</button>
            )}
          </div>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-200 border-t border-neutral-800 pt-6">Projects List</h3>
        {projects.length === 0 ? (
          <p className="text-neutral-500">No project entries added yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((item, idx) => (
              <div key={item.id || idx} className="flex flex-col md:flex-row md:items-start justify-between bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  {item.image && (
                    <div className="shrink-0">
                      <img src={item.image} alt={item.title} className="w-24 h-24 rounded-lg object-cover border border-neutral-700" />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-neutral-400 text-sm">{item.description}</p>
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.technologies.map((tech, i) => (
                          <span key={i} className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                          🔗 Live Demo
                        </a>
                      )}
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                          🐙 GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-start">
                  <div className="flex gap-1 border-r border-neutral-800 pr-3 mr-1">
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Up">▲</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === projects.length - 1} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Down">▼</button>
                  </div>
                  <button type="button" onClick={() => setEditingIndex(idx)} className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 text-sm font-semibold text-blue-400 transition border border-blue-500/20">Edit</button>
                  <button type="button" onClick={() => handleDelete(idx)} className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-sm font-semibold text-red-400 transition border border-red-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExtraActivitiesEditor({ extraActivities, onChange }) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [activity, setActivity] = useState('');

  useEffect(() => {
    if (editingIndex >= 0 && extraActivities[editingIndex]) {
      setActivity(extraActivities[editingIndex]);
    } else {
      setActivity('');
    }
  }, [editingIndex, extraActivities]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!activity.trim()) {
      alert('Activity text is required');
      return;
    }

    const updated = [...extraActivities];
    if (editingIndex >= 0) {
      updated[editingIndex] = activity.trim();
    } else {
      updated.push(activity.trim());
    }

    onChange(updated);
    setEditingIndex(-1);
    setActivity('');
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setActivity('');
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      onChange(extraActivities.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...extraActivities];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index === extraActivities.length - 1) return;
    const updated = [...extraActivities];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">{editingIndex >= 0 ? 'Edit Activity' : 'Add New Activity'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Activity</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-emerald-400 font-sans"
              placeholder="e.g. Participated in hackathon..."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-neutral-950 hover:bg-emerald-400 transition">{editingIndex >= 0 ? 'Update Entry' : 'Add Entry'}</button>
            {editingIndex >= 0 && (
              <button type="button" onClick={handleCancel} className="rounded-xl bg-neutral-700 px-6 py-2.5 text-white hover:bg-neutral-600 transition">Cancel</button>
            )}
          </div>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-200 border-t border-neutral-800 pt-6">Activities List</h3>
        {extraActivities.length === 0 ? (
          <p className="text-neutral-500">No activities added yet.</p>
        ) : (
          <div className="space-y-4">
            {extraActivities.map((item, idx) => (
              <div key={`${item}-${idx}`} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-4">
                <div className="space-y-1">
                  <p className="text-neutral-300 font-medium">{item}</p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="flex gap-1 border-r border-neutral-800 pr-3 mr-1">
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Up">▲</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === extraActivities.length - 1} className="p-1.5 text-neutral-400 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-neutral-400 transition" title="Move Down">▼</button>
                  </div>
                  <button type="button" onClick={() => setEditingIndex(idx)} className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-1.5 text-sm font-semibold text-blue-400 transition border border-blue-500/20">Edit</button>
                  <button type="button" onClick={() => handleDelete(idx)} className="rounded-lg bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-sm font-semibold text-red-400 transition border border-red-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
    const { refreshPortfolio } = useContext(PortfolioContext);
    const [adminKey, setAdminKey] = useState(() => localStorage.getItem('portfolio_admin_key') || '');
    const [isVerified, setIsVerified] = useState(false);
    const [data, setData] = useState(EMPTY_DATA);
    const [jsonState, setJsonState] = useState(() => Object.fromEntries(jsonFields.map(({ key }) => [key, '[]'])));
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const isJsonValid = useMemo(() => {
      try {
        jsonFields.forEach(({ key }) => JSON.parse(jsonState[key] || '[]'));
        return true;
      } catch {
        return false;
      }
    }, [jsonState]);

    const syncJsonState = (portfolio) => {
      const states = Object.fromEntries(jsonFields.map(({ key }) => [key, formatJson(portfolio[key])]));
      states.socialLinks = formatJson(portfolio.socialLinks);
      setJsonState(states);
    };

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const { data: portfolio } = await axios.get(`${API_URL}/api/portfolio`);
        const nextData = { ...EMPTY_DATA, ...portfolio, personalInfo: { ...EMPTY_DATA.personalInfo, ...portfolio.personalInfo } };
        setData(nextData);
        syncJsonState(nextData);
      } catch (err) {
        if (err.response?.status === 404) {
          // No data in backend yet, use the local defaults
          setData(EMPTY_DATA);
          syncJsonState(EMPTY_DATA);
        } else {
          setError(err.response?.data?.message || err.message || 'Portfolio data load nahi hua');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyKey = async (event) => {
      event.preventDefault();
      return verifyAdminKey(adminKey);
    };

    const verifyAdminKey = async (key) => {
      setVerifying(true);
      setStatus('');
      setError('');

      try {
        if (!key.trim()) throw new Error('Admin key required hai');

        await axios.get(`${API_URL}/api/portfolio/admin/verify`, {
          headers: { 'x-admin-key': key.trim() },
        });

        localStorage.setItem('portfolio_admin_key', key.trim());
        setIsVerified(true);
        setStatus('Admin key verify ho gayi. Ab portfolio update kar sakte ho.');
        await fetchPortfolio();
        if (typeof refreshPortfolio === 'function') await refreshPortfolio();
      } catch (err) {
        localStorage.removeItem('portfolio_admin_key');
        setIsVerified(false);
        setError(err.response?.data?.message || err.message || 'Admin key galat hai');
      } finally {
        setVerifying(false);
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('portfolio_admin_key');
      setIsVerified(false);
      setStatus('');
      setError('');
    };

    useEffect(() => {
      if (adminKey && !isVerified) {
        verifyAdminKey(adminKey);
      }
    }, []);

    const updatePersonalInfo = (field, value) => {
      setData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    };

    const [uploadingCv, setUploadingCv] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleCvUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('cvFile', file);

      setUploadingCv(true);
      setError('');
      setStatus('');

      try {
        if (!adminKey.trim()) throw new Error('Admin key required');
        const { data: response } = await axios.post(`${API_URL}/api/portfolio/admin/upload-cv`, formData, {
          headers: {
            'x-admin-key': adminKey.trim(),
            'Content-Type': 'multipart/form-data',
          },
        });

        updatePersonalInfo('cvUrl', response.cvUrl);
        setStatus('CV uploaded! Click Save Changes to commit to database.');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'CV Upload failed');
      } finally {
        setUploadingCv(false);
      }
    };

    const handleProjectImageUpload = async (file) => {
      if (!file) return null;

      const formData = new FormData();
      formData.append('projectImage', file);

      setUploadingImage(true);
      setError('');
      setStatus('');

      try {
        if (!adminKey.trim()) throw new Error('Admin key required');
        const { data: response } = await axios.post(`${API_URL}/api/portfolio/admin/upload-project-image`, formData, {
          headers: {
            'x-admin-key': adminKey.trim(),
            'Content-Type': 'multipart/form-data',
          },
        });

        setStatus('Project image uploaded successfully!');
        return response.imageUrl;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Project image upload failed');
        return null;
      } finally {
        setUploadingImage(false);
      }
    };

    const buildPayload = () => {
      const parsedSections = Object.fromEntries(jsonFields.map(({ key }) => [key, JSON.parse(jsonState[key] || '[]')]));

      let parsedSocialLinks = [];
      try {
        parsedSocialLinks = JSON.parse(jsonState['socialLinks'] || '[]');
      } catch {
        parsedSocialLinks = [];
      }

      return {
        personalInfo: data.personalInfo,
        socialLinks: parsedSocialLinks,
        ...parsedSections,
      };
    };

    const handleSave = async () => {
      setSaving(true);
      setStatus('');
      setError('');

      try {
        if (!adminKey.trim()) throw new Error('Admin key required hai');
        const payload = buildPayload();
        const { data: response } = await axios.put(`${API_URL}/api/portfolio`, payload, {
          headers: { 'x-admin-key': adminKey.trim() },
        });

        localStorage.setItem('portfolio_admin_key', adminKey.trim());
        const saved = { ...EMPTY_DATA, ...response.portfolio, personalInfo: { ...EMPTY_DATA.personalInfo, ...response.portfolio.personalInfo } };
        setData(saved);
        syncJsonState(saved);
        if (typeof refreshPortfolio === 'function') await refreshPortfolio();
        setStatus('Portfolio successfully update ho gaya. Public page par latest data dikh raha hai.');
      } catch (err) {
        if (err.name === 'SyntaxError') {
          setError('JSON format galat hai. Brackets, commas aur quotes check karo.');
        } else {
          setError(err.response?.data?.message || err.message || 'Save failed');
        }
      } finally {
        setSaving(false);
      }
    };

    const tabs = [{ key: 'personalInfo', label: 'Personal Info' }, ...jsonFields];

    if (!isVerified) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8 text-white">
          <form onSubmit={handleVerifyKey} className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Portfolio Admin</p>
            <h1 className="mt-3 text-3xl font-bold">Admin Key Required</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Pehle admin key enter karo. Key sahi hogi tabhi update vala section dikhega.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-neutral-300" htmlFor="admin-key">
                Admin Key
              </label>
              <input
                id="admin-key"
                type="password"
                autoFocus
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                placeholder="Enter admin key"
              />
              <p className="mt-2 text-xs text-neutral-500">Server `.env` ni `ADMIN_KEY` same hovi joie.</p>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="mt-6 w-full rounded-full bg-emerald-400 px-6 py-3 font-bold text-neutral-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {verifying ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <a href="/" className="mt-4 block text-center text-sm text-neutral-400 transition hover:text-emerald-300">
              Back to portfolio
            </a>

            <div className="mt-5 min-h-5 text-sm">
              {error && <p className="text-red-400">{error}</p>}
              {status && <p className="text-emerald-400">{status}</p>}
            </div>
          </form>
        </div>
      );
    }

    if (loading) {
      return <div className="min-h-screen bg-neutral-950 p-8 text-white">Loading admin panel...</div>;
    }

    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-8 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Portfolio Admin</p>
              <h1 className="mt-2 text-3xl font-bold">Update Portfolio Content</h1>
              <p className="mt-2 text-neutral-400">Yahan se personal info, education, experience, skills, projects aur activities update kar sakte ho.</p>
            </div>
            <a href="/" className="rounded-full border border-neutral-700 px-5 py-3 text-center font-semibold text-neutral-200 transition hover:border-emerald-400 hover:text-emerald-300">
              View Site
            </a>
          </div>

          <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-emerald-400">Admin key verified</p>
                <p className="mt-1 text-sm text-neutral-500">Ab aap portfolio content update kar sakte ho.</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-neutral-700 px-5 py-2 text-sm font-semibold text-neutral-200 transition hover:border-red-400 hover:text-red-300"
              >
                Change Key
              </button>
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-emerald-500 text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
            {activeTab === 'personalInfo' ? (
              <div className="grid gap-5 md:grid-cols-2">
                <AdminField label="Name" value={data.personalInfo.name} onChange={(value) => updatePersonalInfo('name', value)} />
                <AdminField label="Title" value={data.personalInfo.title} onChange={(value) => updatePersonalInfo('title', value)} />
                <AdminField label="Email" value={data.personalInfo.email} onChange={(value) => updatePersonalInfo('email', value)} />
                <AdminField label="Phone" value={data.personalInfo.phone} onChange={(value) => updatePersonalInfo('phone', value)} />
                <AdminField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(value) => updatePersonalInfo('linkedin', value)} />
                <AdminField label="GitHub" value={data.personalInfo.github} onChange={(value) => updatePersonalInfo('github', value)} />
                <AdminField label="Location" value={data.personalInfo.location} onChange={(value) => updatePersonalInfo('location', value)} />

                <div className="md:col-span-2">
                  <label className="block mb-4">
                    <span className="mb-2 block text-sm font-semibold text-neutral-300">CV File</span>
                    <div className="flex items-center gap-4">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" id="cv-upload" />
                      <label htmlFor="cv-upload" className="cursor-pointer rounded-xl bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition">
                        {uploadingCv ? 'Uploading...' : 'Upload New CV'}
                      </label>
                      {data.personalInfo.cvUrl && (
                        <span className="text-sm text-emerald-400">Current: {data.personalInfo.cvUrl}</span>
                      )}
                    </div>
                  </label>
                  <AdminField label="About" value={data.personalInfo.about} onChange={(value) => updatePersonalInfo('about', value)} multiline />
                  <AdminField label="My Story" value={data.personalInfo.myStory} onChange={(value) => updatePersonalInfo('myStory', value)} multiline />
                </div>
              </div>
            ) : activeTab === 'education' ? (
              <EducationEditor
                education={(() => {
                  try {
                    return JSON.parse(jsonState['education'] || '[]');
                  } catch {
                    return [];
                  }
                })()}
                onChange={(edu) => setJsonState((prev) => ({ ...prev, education: JSON.stringify(edu, null, 2) }))}
              />
            ) : activeTab === 'experience' ? (
              <ExperienceEditor
                experience={(() => {
                  try {
                    return JSON.parse(jsonState['experience'] || '[]');
                  } catch {
                    return [];
                  }
                })()}
                onChange={(value) => setJsonState((prev) => ({ ...prev, experience: JSON.stringify(value, null, 2) }))}
              />
            ) : activeTab === 'skills' ? (
              <SkillsEditor
                skills={(() => {
                  try {
                    return JSON.parse(jsonState['skills'] || '[]');
                  } catch {
                    return [];
                  }
                })()}
                onChange={(value) => setJsonState((prev) => ({ ...prev, skills: JSON.stringify(value, null, 2) }))}
              />
            ) : activeTab === 'projects' ? (
              <ProjectsEditor
                projects={(() => {
                  try {
                    return JSON.parse(jsonState['projects'] || '[]');
                  } catch {
                    return [];
                  }
                })()}
                onChange={(value) => setJsonState((prev) => ({ ...prev, projects: JSON.stringify(value, null, 2) }))}
                onImageUpload={handleProjectImageUpload}
                uploadingImage={uploadingImage}
                adminKey={adminKey}
                apiUrl={API_URL}
              />
            ) : activeTab === 'extraActivities' ? (
              <ExtraActivitiesEditor
                extraActivities={(() => {
                  try {
                    return JSON.parse(jsonState['extraActivities'] || '[]');
                  } catch {
                    return [];
                  }
                })()}
                onChange={(value) => setJsonState((prev) => ({ ...prev, extraActivities: JSON.stringify(value, null, 2) }))}
              />
            ) : (
              jsonFields
                .filter(({ key }) => key === activeTab)
                .map(({ key, label }) => (
                  <JsonEditor key={key} label={label} value={jsonState[key]} onChange={(value) => setJsonState((prev) => ({ ...prev, [key]: value }))} />
                ))
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-6 text-sm">
                {status && <p className="text-emerald-400">{status}</p>}
                {error && <p className="text-red-400">{error}</p>}
                {!isJsonValid && <p className="text-yellow-400">JSON invalid hai, save karne se pehle fix karo.</p>}
              </div>
              <button
                type="button"
                disabled={saving || !isJsonValid}
                onClick={handleSave}
                className="rounded-full bg-emerald-400 px-8 py-3 font-bold text-neutral-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } 
