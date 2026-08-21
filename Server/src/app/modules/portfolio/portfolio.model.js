const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      location: { type: String, default: '' },
      about: { type: String, default: '' },
      cvUrl: { type: String, default: '' },
    },
    education: [
      {
        id: Number,
        period: String,
        degree: String,
        institution: String,
        details: [String],
      },
    ],
    experience: [
      {
        id: Number,
        period: String,
        role: String,
        company: String,
        details: [String],
      },
    ],
    skills: [
      {
        category: String,
        items: [String],
      },
    ],
    projects: [
      {
        id: Number,
        title: String,
        tech: String,
        description: String,
        liveDemo: String,
        githubLink: String,
      },
    ],
    extraActivities: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
