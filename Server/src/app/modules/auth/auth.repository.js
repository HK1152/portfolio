const prisma = require('../../config/prismaClient');
const bcrypt = require('bcryptjs');

class AuthRepository {
  async findByAdminId(adminId) {
    return await prisma.user.findUnique({
      where: { adminId },
    });
  }

  async createUser(userData) {
    // Hash password before saving since Prisma doesn't have hooks
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    return await prisma.user.create({
      data: {
        adminId: userData.adminId,
        password: hashedPassword,
        role: userData.role || 'admin',
      },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        adminId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

module.exports = new AuthRepository();
