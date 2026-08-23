import React from 'react';
import {
  SiReact, SiHtml5, SiCss, SiJavascript, SiTailwindcss, SiBootstrap,
  SiNodedotjs, SiExpress, SiMongodb, SiGithub, SiC, SiCplusplus,
  SiPostman, SiNetlify, SiTypescript, SiPython, SiMysql,
  SiPostgresql, SiFirebase, SiDocker, SiFigma,
  SiVite, SiNextdotjs, SiVuedotjs, SiAngular, SiSass, SiGit,
  SiLinux, SiUbuntu, SiApple, SiAndroid, SiNpm, SiYarn,
  SiGraphql, SiRedux, SiJest, SiCypress, SiDjango, SiFlask, SiPhp,
  SiLaravel, SiWordpress, SiShopify, SiRust, SiGo, SiKotlin, SiSwift,
  SiFramer, SiSupabase, SiPrisma, SiVercel, SiRender, SiHeroku,
  SiDigitalocean, SiCloudflare, SiN8N
} from 'react-icons/si';
import { TbBrandAdobePhotoshop, TbBrandAdobeIllustrator } from 'react-icons/tb';

export const availableTechIcons = [
  { id: 'SiReact', name: 'React', icon: SiReact },
  { id: 'SiHtml5', name: 'HTML5', icon: SiHtml5 },
  { id: 'SiCss', name: 'CSS3', icon: SiCss },
  { id: 'SiJavascript', name: 'JavaScript', icon: SiJavascript },
  { id: 'SiTypescript', name: 'TypeScript', icon: SiTypescript },
  { id: 'SiTailwindcss', name: 'Tailwind CSS', icon: SiTailwindcss },
  { id: 'SiBootstrap', name: 'Bootstrap', icon: SiBootstrap },
  { id: 'SiSass', name: 'Sass', icon: SiSass },
  
  { id: 'SiNodedotjs', name: 'Node.js', icon: SiNodedotjs },
  { id: 'SiExpress', name: 'Express.js', icon: SiExpress },
  { id: 'SiNextdotjs', name: 'Next.js', icon: SiNextdotjs },
  { id: 'SiVuedotjs', name: 'Vue.js', icon: SiVuedotjs },
  { id: 'SiAngular', name: 'Angular', icon: SiAngular },
  
  { id: 'SiMongodb', name: 'MongoDB', icon: SiMongodb },
  { id: 'SiMysql', name: 'MySQL', icon: SiMysql },
  { id: 'SiPostgresql', name: 'PostgreSQL', icon: SiPostgresql },
  { id: 'SiFirebase', name: 'Firebase', icon: SiFirebase },
  { id: 'SiSupabase', name: 'Supabase', icon: SiSupabase },
  { id: 'SiPrisma', name: 'Prisma', icon: SiPrisma },
  
  { id: 'SiPython', name: 'Python', icon: SiPython },
  { id: 'SiC', name: 'C', icon: SiC },
  { id: 'SiCplusplus', name: 'C++', icon: SiCplusplus },
  { id: 'SiRust', name: 'Rust', icon: SiRust },
  { id: 'SiGo', name: 'Go', icon: SiGo },
  { id: 'SiKotlin', name: 'Kotlin', icon: SiKotlin },
  { id: 'SiSwift', name: 'Swift', icon: SiSwift },
  { id: 'SiPhp', name: 'PHP', icon: SiPhp },
  
  { id: 'SiGithub', name: 'GitHub', icon: SiGithub },
  { id: 'SiGit', name: 'Git', icon: SiGit },
  { id: 'SiNpm', name: 'npm', icon: SiNpm },
  { id: 'SiYarn', name: 'Yarn', icon: SiYarn },
  { id: 'SiDocker', name: 'Docker', icon: SiDocker },
  
  { id: 'SiVercel', name: 'Vercel', icon: SiVercel },
  { id: 'SiNetlify', name: 'Netlify', icon: SiNetlify },
  { id: 'SiRender', name: 'Render', icon: SiRender },
  { id: 'SiHeroku', name: 'Heroku', icon: SiHeroku },
  { id: 'SiDigitalocean', name: 'DigitalOcean', icon: SiDigitalocean },
  { id: 'SiCloudflare', name: 'Cloudflare', icon: SiCloudflare },
  
  { id: 'SiPostman', name: 'Postman', icon: SiPostman },
  { id: 'SiFigma', name: 'Figma', icon: SiFigma },
  { id: 'SiFramer', name: 'Framer', icon: SiFramer },
  { id: 'TbBrandAdobePhotoshop', name: 'Photoshop', icon: TbBrandAdobePhotoshop },
  { id: 'TbBrandAdobeIllustrator', name: 'Illustrator', icon: TbBrandAdobeIllustrator },
  
  { id: 'SiLinux', name: 'Linux', icon: SiLinux },
  { id: 'SiUbuntu', name: 'Ubuntu', icon: SiUbuntu },
  { id: 'SiApple', name: 'Apple', icon: SiApple },
  { id: 'SiAndroid', name: 'Android', icon: SiAndroid },
  
  { id: 'SiGraphql', name: 'GraphQL', icon: SiGraphql },
  { id: 'SiRedux', name: 'Redux', icon: SiRedux },
  { id: 'SiJest', name: 'Jest', icon: SiJest },
  { id: 'SiCypress', name: 'Cypress', icon: SiCypress },
  
  { id: 'SiDjango', name: 'Django', icon: SiDjango },
  { id: 'SiFlask', name: 'Flask', icon: SiFlask },
  { id: 'SiLaravel', name: 'Laravel', icon: SiLaravel },
  { id: 'SiWordpress', name: 'WordPress', icon: SiWordpress },
  { id: 'SiShopify', name: 'Shopify', icon: SiShopify },
  
  { id: 'SiVite', name: 'Vite', icon: SiVite },
  { id: 'SiN8N', name: 'n8n', icon: SiN8N },
];

import { Icon } from '@iconify/react';

export const getIconComponent = (iconId) => {
  // If it's an Iconify ID (contains a colon like "logos:react")
  if (iconId && iconId.includes(':')) {
    return (props) => <Icon icon={iconId} {...props} />;
  }
  
  // Fallback to legacy hardcoded react-icons
  const iconItem = availableTechIcons.find(icon => icon.id === iconId);
  return iconItem ? iconItem.icon : null;
};
