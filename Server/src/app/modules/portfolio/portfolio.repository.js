const prisma = require('../../config/prismaClient');

class PortfolioRepository {
  async getLatestPortfolio() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
      },
    });

    if (!portfolio) return null;

    // Map Prisma flat structure back to the nested structure frontend expects
    return {
      _id: portfolio.id,
      personalInfo: {
        name: portfolio.name,
        title: portfolio.title,
        email: portfolio.email,
        phone: portfolio.phone,
        linkedin: portfolio.linkedin,
        github: portfolio.github,
        location: portfolio.location,
        about: portfolio.about,
        cvUrl: portfolio.cvUrl,
      },
      education: portfolio.educations,
      experience: portfolio.experiences,
      skills: portfolio.skills,
      projects: portfolio.projects,
      extraActivities: portfolio.extraActivities,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };
  }

  async createOrUpdatePortfolio(data) {
    const existing = await prisma.portfolio.findFirst();

    const portfolioData = {
      name: data.personalInfo?.name || '',
      title: data.personalInfo?.title || '',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || null,
      linkedin: data.personalInfo?.linkedin || null,
      github: data.personalInfo?.github || null,
      location: data.personalInfo?.location || null,
      about: data.personalInfo?.about || null,
      cvUrl: data.personalInfo?.cvUrl || null,
      extraActivities: data.extraActivities || [],
    };

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          ...portfolioData,
          educations: {
            deleteMany: {},
            create: data.education || [],
          },
          experiences: {
            deleteMany: {},
            create: data.experience || [],
          },
          skills: {
            deleteMany: {},
            create: data.skills || [],
          },
          projects: {
            deleteMany: {},
            create: data.projects || [],
          },
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          ...portfolioData,
          educations: {
            create: data.education || [],
          },
          experiences: {
            create: data.experience || [],
          },
          skills: {
            create: data.skills || [],
          },
          projects: {
            create: data.projects || [],
          },
        },
      });
    }

    return await this.getLatestPortfolio();
  }
}

module.exports = new PortfolioRepository();
