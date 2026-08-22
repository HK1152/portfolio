import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../../../context/PortfolioContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { cvData } = useContext(PortfolioContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold text-emerald-500">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-2">Welcome back, {user?.adminId}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-full border border-neutral-700 hover:border-neutral-500 text-neutral-300 transition-all text-sm font-medium"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats / Overview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Projects</h3>
            <div className="text-4xl font-black text-emerald-500">{cvData?.projects?.length || 0}</div>
            <p className="text-neutral-400 mt-2 text-sm">Total projects in portfolio</p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Experience</h3>
            <div className="text-4xl font-black text-emerald-500">{cvData?.experience?.length || 0}</div>
            <p className="text-neutral-400 mt-2 text-sm">Total roles added</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Skills</h3>
            <div className="text-4xl font-black text-emerald-500">{cvData?.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0}</div>
            <p className="text-neutral-400 mt-2 text-sm">Total skills listed</p>
          </div>
        </div>

        <div className="mt-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
          <div className="inline-block p-4 bg-emerald-500/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Portfolio Management</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            The data management interface allows you to edit the JSON data directly via API endpoints. 
            Forms for updating specific sections will be implemented in future iterations. 
            Right now, your admin route is securely protected!
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
