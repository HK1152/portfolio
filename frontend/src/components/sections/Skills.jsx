import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '../ui/SectionHeading';
import LogoLoop from '../effects/LogoLoop';
import { PortfolioContext } from '../../context/PortfolioContext';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';
import { getIconComponent } from '../../utils/techIcons';
import SEO from '../ui/SEO';

export const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { cvData } = useContext(PortfolioContext);
  const skills = cvData?.skills || [];
  const rawTechLogos = cvData?.techLogos || [];

  // Map the raw DB techLogos to the format LogoLoop expects
  const dynamicTechLogos = rawTechLogos.map((logo) => {
    const Icon = getIconComponent(logo.iconName);
    return {
      node: Icon ? <Icon /> : <div className="w-8 h-8 rounded-full bg-neutral-800" />,
      title: logo.title,
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="pt-32 pb-20 min-h-screen bg-black px-4 sm:px-6 lg:px-8 relative">
      <SEO 
        title="Skills | Kavya Patel"
        description="Technical skills and expertise of Kavya Patel, including React.js, Node.js, n8n, and various web development tools."
      />
      {/* Background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="My Skills"
          subtitle="Technologies and tools I work with."
        />

        {/* Logo Loop Marquee */}
        {dynamicTechLogos.length > 0 && (
          <div className="mb-10 py-8">
            <LogoLoop
              logos={dynamicTechLogos}
              speed={60}
              direction="left"
              logoHeight={45}
              gap={60}
              fadeOut={true}
              fadeOutColor="#000000"
              hoverSpeed={10}
              scaleOnHover={true}
              ariaLabel="Technical Skills Logoloop"
            />
          </div>
        )}

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skillGroup, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
            >
              <CardContainer containerClassName="w-full h-full py-0" className="w-full h-full">
                <CardBody className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-primary-500/50 transition-colors duration-300 group/card w-full h-full flex flex-col items-start justify-start shadow-xl">
                  <CardItem
                    translateZ="40"
                    className="text-xl font-bold text-white mb-4 group-hover/card:text-primary-400 transition-colors w-full"
                  >
                    {skillGroup.category}
                  </CardItem>
                  <CardItem translateZ="60" className="flex flex-wrap gap-2 w-full">
                    {skillGroup.items?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
