const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    title: String,
    email: String,
    phone: String,
    linkedin: String,
    about: String
  },
  education: [
    {
      id: Number,
      period: String,
      degree: String,
      institution: String,
      details: [String]
    }
  ],
  experience: [
    {
      id: Number,
      period: String,
      role: String,
      company: String,
      details: [String]
    }
  ],
  skills: [
    {
      category: String,
      items: [String]
    }
  ],
  projects: [
    {
      id: Number,
      title: String,
      tech: String,
      description: String
    }
  ],
  extraActivities: [String]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
