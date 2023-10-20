import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ status: false, message: "Access denied. User not logged in." });
    }
    const splitToken = token.split("Bearer ")[1]  
    try {
      const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ status: false, message: "Invalid token." });
    }
  }