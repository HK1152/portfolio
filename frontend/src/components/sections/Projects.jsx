import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '../ui/SectionHeading';
import { PortfolioContext } from '../../context/PortfolioContext';
import { Tag, Code2, Cpu, Database, Layout, Link as LinkIcon, Terminal, Globe, Monitor } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SEO from '../ui/SEO';
import './Projects.css';



// Technology to Icon mapping
const getTechIcon = (tech) => {
  if (!tech) return <Globe size={16} />;
  const t = tech.toLowerCase();
  if (t.includes('react')) return <Code2 size={16} />;
  if (t.includes('node') || t.includes('express')) return <Terminal size={16} />;
  if (t.includes('mongo') || t.includes('database')) return <Database size={16} />;
  if (t.includes('n8n') || t.includes('ai') || t.includes('automation')) return <Cpu size={16} />;
  if (t.includes('api')) return <LinkIcon size={16} />;
  if (t.includes('html') || t.includes('css') || t.includes('bootstrap') || t.includes('tailwind')) return <Layout size={16} />;
  if (t.includes('javascript') || t.includes('js')) return <Code2 size={16} />;
  if (t.includes('banking') || t.includes('finance')) return <Database size={16} />;
  if (t.includes('game') || t.includes('tic tac toe')) return <Monitor size={16} />;
  return <Tag size={16} />;
};

export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { cvData } = useContext(PortfolioContext);
  const projects = cvData?.projects || [];

  return (
    <section id="projects" className="pt-32 pb-20 min-h-screen bg-black px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Projects | Kavya Patel"
        description="Explore the portfolio of projects by Kavya Patel, featuring full-stack applications and AI automation workflows."
      />
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Featured Projects" 
          subtitle="A selection of my recent work and technical projects."
        />

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => {
            const techs = (project.tech || '').split(', ');
            return (
              <motion.div
                key={project._id || project.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flight-card flight-card--split h-full flex flex-col">
                  <div className="flight-card__image-container">
                    <img
                      className="flight-card__image"
                      src={project.image || 'https://via.placeholder.com/641x641/171717/3f3f3f?text=Project'}
                      alt={project.title}
                      loading="lazy"
                      width="641"
                      height="641"
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
                      {project.liveDemo ? (
                        <button 
                          className="flight-card__search-btn" 
                          type="button"
                          onClick={() => {
                            if (project.liveDemo && !project.liveDemo.includes('example.com')) {
                              const url = project.liveDemo.startsWith('http') ? project.liveDemo : `https://${project.liveDemo}`;
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          Live Demo
                        </button>
                      ) : null}
                      
                      {project.githubLink ? (
                        <button
                          className="flight-card__favorite-btn"
                          type="button"
                          title="View on GitHub"
                          onClick={() => {
                            if (project.githubLink && !project.githubLink.includes('example.com')) {
                              const url = project.githubLink.startsWith('http') ? project.githubLink : `https://${project.githubLink}`;
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <FaGithub size={18} aria-hidden="true" />
                        </button>
                      ) : (
                        <div 
                          className="px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-400 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-not-allowed"
                          title="This repository is private"
                        >
                          Private
                        </div>
                      )}
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
