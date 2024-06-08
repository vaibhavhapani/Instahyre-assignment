const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Please login.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(400).json({
          message: "Invalid or expired token. Please login again.",
        });
      }

      req.id = decodedToken.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
