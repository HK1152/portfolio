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
      
      // Set JWT as httpOnly cookie
      res.cookie('jwt', authData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // Remove token from payload response to enforce cookie usage
      const { token, ...userData } = authData;

      res.status(200).json({
        success: true,
        data: userData
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

  logout = catchAsync(async (req, res) => {
    res.cookie('jwt', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
}

module.exports = new AuthController();
