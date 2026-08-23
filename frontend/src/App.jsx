import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';

import MainLayout from './components/layout/MainLayout';
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Sections
import Hero from './components/sections/Hero';
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Contact = lazy(() => import('./components/sections/Contact'));

// Admin Pages
const Login = lazy(() => import('./components/pages/admin/Login'));
const AdminHome = lazy(() => import('./components/pages/admin/AdminHome'));
const AdminAbout = lazy(() => import('./components/pages/admin/AdminAbout'));
const AdminSkills = lazy(() => import('./components/pages/admin/AdminSkills'));
const AdminExperience = lazy(() => import('./components/pages/admin/AdminExperience'));
const AdminProjects = lazy(() => import('./components/pages/admin/AdminProjects'));
const AdminContact = lazy(() => import('./components/pages/admin/AdminContact'));
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
