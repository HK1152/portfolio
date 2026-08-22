const AuthRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  }

  async loginUser(adminId, password) {
    const user = await AuthRepository.findByAdminId(adminId);

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        adminId: user.adminId,
        role: user.role,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error('Invalid Admin ID or password');
    }
  }

  async getAdminProfile(id) {
    const user = await AuthRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
