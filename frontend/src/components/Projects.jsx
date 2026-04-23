import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from './SectionHeading';
import { PortfolioContext } from '../context/PortfolioContext';
import { useContext } from 'react';
import { Plane, Tag, Heart, Code2, Cpu, Database, Layout, Link, Terminal, Globe, Monitor } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import clsx from 'clsx';
import './Projects.css';

// Project images mapping
import ai_automation from '../assets/projects/ai_automation.png';
import employee_sys from '../assets/projects/employee_sys.png';
import tata_cliq from '../assets/projects/tata_cliq.png';
import samsung from '../assets/projects/samsung.png';
import rolex from '../assets/projects/rolex.png';
import banking from '../assets/projects/banking.png';
import tictactoe from '../assets/projects/tictactoe.png';

const projectImages = {
  1: ai_automation,
  2: employee_sys,
  3: tata_cliq,
  4: samsung,
  5: rolex,
  6: banking,
  7: tictactoe,
};

// Technology to Icon mapping
const getTechIcon = (tech) => {
  if (!tech) return <Globe size={16} />;
  const t = tech.toLowerCase();
  if (t.includes('react')) return <Code2 size={16} />;
  if (t.includes('node') || t.includes('express')) return <Terminal size={16} />;
  if (t.includes('mongo') || t.includes('database')) return <Database size={16} />;
  if (t.includes('n8n') || t.includes('ai') || t.includes('automation')) return <Cpu size={16} />;
  if (t.includes('api')) return <Link size={16} />;
  if (t.includes('html') || t.includes('css') || t.includes('bootstrap') || t.includes('tailwind')) return <Layout size={16} />;
  if (t.includes('javascript') || t.includes('js')) return <Code2 size={16} />;
  if (t.includes('banking') || t.includes('finance')) return <Database size={16} />;
  if (t.includes('game') || t.includes('tic tac toe')) return <Monitor size={16} />;
  return <Tag size={16} />;
};

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { cvData } = useContext(PortfolioContext);

  return (
    <section id="projects" className="py-20 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Featured Projects" 
          subtitle="A selection of my recent work and technical projects."
        />

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cvData.projects.map((project, index) => {
            const techs = project.tech.split(', ');
            return (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flight-card flight-card--split h-full flex flex-col">
                  <div className="flight-card__image-container">
                    <img
                      className="flight-card__image"
                      src={projectImages[project.id] || projectImages[index + 1] || ai_automation}
                      alt={project.title}
                    />
                  </div>
                  
                  <div className="flight-card__content flex-grow flex flex-col">
                    <h2 className="flight-card__title">{project.title}</h2>
                    <p className="flight-card__class line-clamp-2">{project.description}</p>
                    
                    <div className="flight-card__details mt-auto">
                      <div className="flight-card__detail-item">
                        {getTechIcon(techs[0])}
                        <span className="text-xs font-semibold">{techs[0]}</span>
                      </div>
                      <div className="flight-card__detail-item">
                        {getTechIcon(techs[1])}
                        <span className="text-xs font-semibold">{techs[1] || 'Web Dev'}</span>
                      </div>
                    </div>

                    <div className="flight-card__actions mt-4">
                      <button 
                        className="flight-card__search-btn" 
                        type="button"
                        onClick={() => {
                          if (project.liveDemo && !project.liveDemo.includes('example.com')) {
                            const url = project.liveDemo.startsWith('http') ? project.liveDemo : `https://${project.liveDemo}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            alert('Live Demo link will be added soon!');
                          }
                        }}
                      >
                        Live Demo
                      </button>
                      <button
                        className="flight-card__favorite-btn"
                        type="button"
                        title="View on GitHub"
                        onClick={() => {
                          if (project.githubLink && !project.githubLink.includes('example.com')) {
                            const url = project.githubLink.startsWith('http') ? project.githubLink : `https://${project.githubLink}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            alert('GitHub link will be added soon!');
                          }
                        }}
                      >
                        <FaGithub size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;

