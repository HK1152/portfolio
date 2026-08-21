import React, { useContext } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { PortfolioContext } from '../../context/PortfolioContext';
import { Timeline } from '../ui/timeline';

export const Experience = () => {
  const { cvData } = useContext(PortfolioContext);
  const experienceList = cvData?.experience || [];

  const experiences = experienceList.map((exp) => ({
    title: exp.period,
    content: (
      <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all shadow-xl group">
        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
        <p className="text-blue-400 font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {exp.company}
        </p>
        <ul className="space-y-4">
          {exp.details?.map((detail, idx) => (
            <li key={idx} className="text-neutral-400 text-sm md:text-base leading-relaxed flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-neutral-700 rounded-full mt-2 flex-shrink-0"></span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }));

  return (
    <section id="experience" className="py-20 bg-neutral-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey and industry experience."
        />

        <div className="w-full">
          <Timeline data={experiences} />
        </div>
      </div>
    </section>
  );
};

export default Experience;
