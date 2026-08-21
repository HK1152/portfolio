const ADMIN_HEADER = 'x-admin-key';

const requireAdmin = (req, res, next) => {
  const configuredKey = process.env.ADMIN_KEY?.trim();

  if (!configuredKey) {
    return res.status(500).json({
      message: 'Server ADMIN_KEY missing. Set ADMIN_KEY in Server/.env and restart the server.',
    });
  }

  const providedKey = req.headers[ADMIN_HEADER]?.trim();

  if (!providedKey) {
    return res.status(401).json({ message: 'Admin Key Required' });
  }

  if (providedKey !== configuredKey) {
    return res.status(401).json({ message: 'Invalid Admin Key' });
  }

  next();
};

module.exports = requireAdmin;
