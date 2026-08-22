const User = require('./auth.model');

class AuthRepository {
  async findByAdminId(adminId) {
    return await User.findOne({ adminId });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }
}

module.exports = new AuthRepository();
