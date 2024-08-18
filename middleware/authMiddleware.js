const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

module.exports = (req, res, next) => {
  const encryptedToken = req.header('Authorization')?.replace('Bearer ', '');

  if (!encryptedToken) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const secretKey = process.env.ENCRYPTION_SECRET_KEY;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
