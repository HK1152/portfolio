const AuthService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');

class AuthController {
  login = catchAsync(async (req, res) => {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Admin ID and password' });
    }

    try {
      const authData = await AuthService.loginUser(adminId, password);
      res.status(200).json({
        success: true,
        data: authData
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  });

  getMe = catchAsync(async (req, res) => {
    const user = await AuthService.getAdminProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  });
}

module.exports = new AuthController();
