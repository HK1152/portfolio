const prisma = require('../../config/prismaClient');

class PortfolioRepository {
  stripIds(items) {
    if (!Array.isArray(items)) return [];
    return items.map(({ id, _id, portfolioId, ...rest }) => rest);
  }

  sanitizeProjects(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
      title: (item.title || 'Untitled Project').trim(),
      tech: (item.tech || '').trim(),
      description: (item.description || '').trim(),
      image: item.image ? String(item.image).trim() : null,
      liveDemo: item.liveDemo ? String(item.liveDemo).trim() : null,
      githubLink: item.githubLink ? String(item.githubLink).trim() : null,
    }));
  }

  async getLatestPortfolio() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        educations: { orderBy: { id: 'asc' } },
        certifications: { orderBy: { id: 'asc' } },
        experiences: { orderBy: { id: 'asc' } },
        skills: { orderBy: { id: 'asc' } },
        techLogos: { orderBy: { id: 'asc' } },
        projects: { orderBy: { id: 'asc' } },
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
        linkedin: portfolio.linkedin,
        github: portfolio.github,
        location: portfolio.location,
        about: portfolio.about,
        heroDescription: portfolio.heroDescription,
        cvUrl: portfolio.cvUrl,
      },
      education: portfolio.educations,
      certifications: portfolio.certifications,
      experience: portfolio.experiences,
      skills: portfolio.skills,
      techLogos: portfolio.techLogos,
      projects: portfolio.projects,
      extraActivities: portfolio.extraActivities,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };
  }

  async getAbout() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        educations: { orderBy: { id: 'asc' } },
        certifications: { orderBy: { id: 'asc' } },
      },
    });
    if (!portfolio) return null;
    return {
      about: portfolio.about,
      education: portfolio.educations,
      certifications: portfolio.certifications,
    };
  }

  async updateAbout(data) {
    const existing = await prisma.portfolio.findFirst();
    const portfolioData = {
      about: data.about !== undefined ? data.about : (existing?.about || null),
    };

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          ...portfolioData,
          educations: data.education ? {
            deleteMany: {},
            create: this.stripIds(data.education),
          } : undefined,
          certifications: data.certifications ? {
            deleteMany: {},
            create: this.stripIds(data.certifications),
          } : undefined,
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          name: '', title: '', email: '',
          ...portfolioData,
          educations: data.education ? {
            create: this.stripIds(data.education),
          } : undefined,
          certifications: data.certifications ? {
            create: this.stripIds(data.certifications),
          } : undefined,
        },
      });
    }
    return await this.getAbout();
  }

  async createOrUpdatePortfolio(data) {
    const existing = await prisma.portfolio.findFirst();

    const portfolioData = {
      name: data.personalInfo?.name || '',
      title: data.personalInfo?.title || '',
      email: data.personalInfo?.email || '',
      linkedin: data.personalInfo?.linkedin || null,
      github: data.personalInfo?.github || null,
      location: data.personalInfo?.location || null,
      about: data.personalInfo?.about || null,
      heroDescription: data.personalInfo?.heroDescription || null,
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
            create: this.stripIds(data.education),
          },
          certifications: {
            deleteMany: {},
            create: this.stripIds(data.certifications),
          },
          experiences: {
            deleteMany: {},
            create: this.stripIds(data.experience),
          },
          skills: {
            deleteMany: {},
            create: this.stripIds(data.skills),
          },
          projects: {
            deleteMany: {},
            create: this.sanitizeProjects(data.projects),
          },
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          ...portfolioData,
          educations: {
            create: this.stripIds(data.education),
          },
          certifications: {
            create: this.stripIds(data.certifications),
          },
          experiences: {
            create: this.stripIds(data.experience),
          },
          skills: {
            create: this.stripIds(data.skills),
          },
          projects: {
            create: this.sanitizeProjects(data.projects),
          },
        },
      });
    }

    return await this.getLatestPortfolio();
  }

  async getDashboard() {
    const portfolio = await prisma.portfolio.findFirst();
    if (!portfolio) return null;
    return {
      name: portfolio.name,
      title: portfolio.title,
      email: portfolio.email,
      linkedin: portfolio.linkedin,
      github: portfolio.github,
      location: portfolio.location,
      about: portfolio.about,
      heroDescription: portfolio.heroDescription,
      cvUrl: portfolio.cvUrl,
      extraActivities: portfolio.extraActivities,
    };
  }

  async updateDashboard(data) {
    const existing = await prisma.portfolio.findFirst();
    
    // Merge with existing data so we don't nullify fields like location/phone/about
    const portfolioData = {
      name: data.name !== undefined ? data.name : (existing?.name || ''),
      title: data.title !== undefined ? data.title : (existing?.title || ''),
      email: data.email !== undefined ? data.email : (existing?.email || ''),
      linkedin: data.linkedin !== undefined ? data.linkedin : (existing?.linkedin || null),
      github: data.github !== undefined ? data.github : (existing?.github || null),
      location: data.location !== undefined ? data.location : (existing?.location || null),
      about: data.about !== undefined ? data.about : (existing?.about || null),
      heroDescription: data.heroDescription !== undefined ? data.heroDescription : (existing?.heroDescription || null),
      cvUrl: data.cvUrl !== undefined ? data.cvUrl : (existing?.cvUrl || null),
    };

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: portfolioData
      });
    } else {
      await prisma.portfolio.create({
        data: portfolioData
      });
    }
    return await this.getDashboard();
  }

  async getContact() {
    const portfolio = await prisma.portfolio.findFirst();
    if (!portfolio) return null;
    return {
      email: portfolio.email,
      location: portfolio.location,
      linkedin: portfolio.linkedin,
      github: portfolio.github,
    };
  }

  async updateContact(data) {
    const existing = await prisma.portfolio.findFirst();
    
    const contactData = {
      email: data.email !== undefined ? data.email : (existing?.email || ''),
      location: data.location !== undefined ? data.location : (existing?.location || null),
      linkedin: data.linkedin !== undefined ? data.linkedin : (existing?.linkedin || null),
      github: data.github !== undefined ? data.github : (existing?.github || null),
    };

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: contactData
      });
    } else {
      await prisma.portfolio.create({
        data: { name: '', title: '', ...contactData }
      });
    }
    return await this.getContact();
  }

  async getSkills() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        skills: true,
        techLogos: true,
      },
    });
    if (!portfolio) return null;
    return {
      skills: portfolio.skills,
      techLogos: portfolio.techLogos,
    };
  }

  async updateSkills(data) {
    const existing = await prisma.portfolio.findFirst();

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          skills: data.skills ? {
            deleteMany: {},
            create: this.stripIds(data.skills),
          } : undefined,
          techLogos: data.techLogos ? {
            deleteMany: {},
            create: this.stripIds(data.techLogos),
          } : undefined,
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          name: '', title: '', email: '',
          skills: data.skills ? {
            create: this.stripIds(data.skills),
          } : undefined,
          techLogos: data.techLogos ? {
            create: this.stripIds(data.techLogos),
          } : undefined,
        },
      });
    }
    return await this.getSkills();
  }

  async getExperience() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        experiences: { orderBy: { id: 'asc' } },
      },
    });
    if (!portfolio) return null;
    return {
      experience: portfolio.experiences,
    };
  }

  async updateExperience(data) {
    const existing = await prisma.portfolio.findFirst();

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          experiences: data.experience ? {
            deleteMany: {},
            create: this.stripIds(data.experience),
          } : undefined,
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          name: '', title: '', email: '',
          experiences: data.experience ? {
            create: this.stripIds(data.experience),
          } : undefined,
        },
      });
    }
    return await this.getExperience();
  }

  async getProjects() {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        projects: { orderBy: { id: 'asc' } },
      },
    });
    if (!portfolio) return null;
    return {
      projects: portfolio.projects,
    };
  }

  async updateProjects(data) {
    const existing = await prisma.portfolio.findFirst();

    if (existing) {
      await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          projects: data.projects ? {
            deleteMany: {},
            create: this.sanitizeProjects(data.projects),
          } : undefined,
        },
      });
    } else {
      await prisma.portfolio.create({
        data: {
          name: '', title: '', email: '',
          projects: data.projects ? {
            create: this.sanitizeProjects(data.projects),
          } : undefined,
        },
      });
    }
    return await this.getProjects();
  }
}
module.exports = new PortfolioRepository();
