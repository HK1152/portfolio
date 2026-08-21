const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const connectDB = require('./config/db');
const Portfolio = require('./models/Portfolio');

// Fix for querySrv ECONNREFUSED
dns.setServers(['8.8.8.8', '8.8.4.4']);

// We will copy the data from frontend here manually for seeding
const cvData = {
  personalInfo: {
    name: "Kavya Patel",
    title: "Full Stack Developer | AI Workflow Automation | n8n | React.Js",
    email: "hk1152studio@gmail.com",
    phone: "+91-93137-52959",
    linkedin: "www.linkedin.com/in/hk1152/",
    about: `        Full Stack Developer with a Bachelor of Computer Applications (BCA) degree and additional professional training in MERN stack (MongoDB, Express.js, React.js, Node.js) from Red & White Multimedia Education. Skilled in building responsive and interactive web applications using modern frontend technologies and backend fundamentals, with a strong focus on JavaScript, structured application design, and database integration.
          In addition to full stack development, I have hands-on experience in AI-driven automation using n8n, including building an end-to-end content automation system that generates stories, creates AI videos, and publishes them automatically to YouTube. Interested in combining web development with intelligent automation to build scalable digital solutions.`
  },
  education: [
    {
      period: "2023 - 2026",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "B P College of Computer Studies, Gandhinagar",
      details: [
        "Focused on computer science fundamentals, programming, and software development concepts",
        "Studied core subjects including data structures, databases, and application development",
        "IEEE Member, participated in technical workshops and collaborative activities"
      ]
    },
    {
      period: "2024 - 2025",
      degree: "Full Stack Development",
      institution: "Red & White Multimedia Education",
      details: [
        "Completed professional training in MongoDB, Express.js, React.js, and Node.js",
        "Gained hands-on experience in building responsive and scalable web applications",
        "Worked on real-world projects covering frontend, backend, and database integration"
      ] 
    }
  ],
  experience: [
    {
      period: "Dec 2025 - Feb 2026",
      role: "Web Development Intern",
      company: "Skillairo EduTech Pvt. Ltd.",
      details: [
        "Worked on hands-on assignments focused on core web development concepts and real-world problem solving.",
        "Developed and improved web pages using HTML, CSS, JavaScript and Bootstrap.",
        "Enhanced understanding of responsive design and clean coding practices through practical tasks."
      ]
    },
    {
      period: "Dec 2025 - Jan 2026",
      role: "Frontend Development",
      company: "Skylink Infosolutions™",
      details: [
        "Assisted in designing and developing web interfaces using HTML, CSS, JavaScript, Bootstrap and basic Figma designs.",
        "Participated in daily stand-up meetings and collaborated with team members on development tasks.",
        "Worked on creating demo applications and presenting progress to the supervisor for feedback.",
        "Learned about real-time project structure, testing, and basic debugging practices.",
        "Improved understanding of user-focused design and development in a professional environment."
      ]
    },
    {
      period: "June 2025 - July 2025",
      role: "Students Summer Internship",
      company: "IEEE Pune Section - IEEE (EBMS) Pune Chapter",
      details: [
        "Collaborated with student teams on technical projects.",
        "Learned practical applications of programming and teamwork in a professional environment.",
        "Contributed to learning projects involving web technologies & problem-solving exercises, simulating real-world development tasks."
      ]
    }
  ],
  skills: [
    { category: "Frontend", items: ["HTML & HTML5", "CSS & CSS3", "Bootstrap", "JavaScript", "Tailwind", "React.js"] },
    { category: "Backend / Programming", items: ["C Language", "C++ (OOPs + DSA)", "NodeJS", "expressJs"] },
    { category: "Database", items: ["MongoDB"] },
    { category: "Tools & Platforms", items: ["Github", "Microsoft Azure AI", "Photoshop (Smart Objects)"] },
    { category: "Automation & AI", items: ["n8n", "AI Content Automation", "Prompt Engineering"] },
    { category: "Soft Skills", items: ["Team Collaboration", "Problem-Solving"] }
  ],
  projects: [
    {
      title: "AI Story-to-YouTube Automation",
      tech: "n8n, AI APIs, JavaScript, YouTube API",
      description: "Built an end-to-end n8n automation that generates a complete story from a title, creates an AI video, and uploads it automatically to YouTube. Integrated multiple APIs using JSON workflows to eliminate manual content creation and publishing."
    },
    {
      title: "Employee Management System",
      tech: "React, JavaScript",
      description: "Developed a role-based Employee Management System where admin can assign tasks to selected users. Implemented user authentication and task visibility based on login roles. Enabled users to view assigned tasks and update their completion status dynamically."
    },
    {
      title: "Tata Cliq Clone",
      tech: "HTML5, CSS3, Bootstrap, JavaScript",
      description: "Developed a fully responsive e-commerce website replicating Tata Cliq's design and functionality. Worked in a team of three, contributing mainly to JavaScript features such as dynamic product display, cart logic, and interactive UI elements."
    },
    {
      title: "Samsung Electronics Clone",
      tech: "HTML5, CSS3, Bootstrap",
      description: "Developed a product showcase clone with responsive grid system using Bootstrap."
    },
    {
      title: "Rolex Watch Clone",
      tech: "HTML5, CSS3, Bootstrap",
      description: "Built an e-commerce style landing page featuring product cards and modern UI components."
    },
    {
      title: "Banking System",
      tech: "HTML5, CSS3, JavaScript",
      description: "Implemented a basic simulation of banking features like deposit, withdraw, and balance check."
    },
    {
      title: "Tic Tac Toe Game",
      tech: "HTML5, CSS3, JavaScript",
      description: "Developed a 2-player interactive game with win-draw logic and responsive UI."
    }
  ],
  extraActivities: [
    "Attended soft skills & interview preparation sessions at Red & White Multimedia Education",
    "Engaged in team-based project work during training and internship",
    "Creative design experience with Canva & Photoshop",
    "Content creation & editing: Video/Photo Editing (Premiere Pro, YouTube Shorts)"
  ]
};

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Portfolio.deleteMany(); // Clear existing
    await Portfolio.create(cvData);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
