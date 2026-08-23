import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Sections
import Hero from './components/sections/Hero';
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Admin Pages
import Login from './components/pages/admin/Login';
import AdminHome from './components/pages/admin/AdminHome';
import AdminAbout from './components/pages/admin/AdminAbout';
import AdminSkills from './components/pages/admin/AdminSkills';
import AdminExperience from './components/pages/admin/AdminExperience';
import AdminProjects from './components/pages/admin/AdminProjects';
import AdminContact from './components/pages/admin/AdminContact';
import ProtectedRoute from './components/ui/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Hero />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="experience" element={<Experience />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } 
      >
        <Route index element={<AdminHome />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="contact" element={<AdminContact />} />
      </Route>
    </Routes>
  );
}

export default App;
