import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from './SectionHeading';
import { BookOpen, GraduationCap } from 'lucide-react';
import { PortfolioContext } from '../context/PortfolioContext';
import { useContext } from 'react';
import Cubes from './Cubes';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { cvData } = useContext(PortfolioContext);

  return (
    <section id="about" className="py-20 bg-neutral-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Cubes Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Cubes
          gridSize={10}
          maxAngle={55}
          radius={3}
          borderStyle="1px solid #3f3f3fff"
          faceColor="#0a0a0a"
          rippleColor="#8aa5cfff"
          rippleSpeed={2}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="About Me"
          subtitle="Get to know me and my educational background."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start about-cards-container relative" ref={ref}>
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden blur-item"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-500 rounded-full inline-block"></span>
              My Story
            </h3>
            <p className="text-neutral-300 leading-relaxed text-lg">
              {cvData.personalInfo.about}
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <GraduationCap className="text-emerald-400" />
              Education
            </h3>

            <div className="space-y-8 education-cards">
              {cvData.education.map((edu, index) => (
                <div key={edu._id || index} className="relative pl-8 before:absolute before:left-3 before:top-2 before:w-0.5 before:h-full before:bg-neutral-800 last:before:hidden education-item">
                  <div className="absolute left-0 top-2 w-6 h-6 bg-emerald-500/20 rounded-full border border-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors education-card-box blur-item">
                    <span className="text-sm font-medium text-emerald-400 inline-block mb-2">
                      {edu.period}
                    </span>
                    <h4 className="text-xl font-bold text-white mb-1">{edu.degree}</h4>
                    <p className="text-neutral-400 text-sm mb-4 font-medium">{edu.institution}</p>
                    <ul className="space-y-2">
                      {edu.details.map((detail, idx) => (
                        <li key={idx} className="text-neutral-300 text-sm flex items-start gap-2">
                          <BookOpen size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
