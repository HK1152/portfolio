import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Award, 
  Briefcase, 
  Code, 
  Mail,
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/admin', end: true, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/about', label: 'About', icon: <User size={20} /> },
    { path: '/admin/skills', label: 'Skills', icon: <Award size={20} /> },
    { path: '/admin/experience', label: 'Experience', icon: <Briefcase size={20} /> },
    { path: '/admin/projects', label: 'Projects', icon: <Code size={20} /> },
    { path: '/admin/contact', label: 'Contact', icon: <Mail size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-neutral-900 border-r border-neutral-800 
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-black">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Admin<span className="text-primary-500">Panel</span></span>
          </div>
          <button 
            className="lg:hidden text-neutral-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-3">
            Management
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-500/10 text-primary-400 font-medium' 
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'}
              `}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-primary-500 font-semibold">
              {user?.adminId?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.adminId || 'Admin'}</p>
              <p className="text-xs text-neutral-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-white hidden sm:block">Dashboard Overview</h2>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 transition-all text-sm font-medium"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">View Site</span>
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
