import jwt from 'jsonwebtoken';
import prisma from '../config/postgres.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token; 
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for revoked tokens
    const blacklistedToken = await prisma.blacklistedToken.findUnique({ where: { token } });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Not authorized, token revoked" });
    }

    // Single Active Session Check
    if (decoded.sid) {
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || !user.currentSessionSid || user.currentSessionSid !== decoded.sid || !user.currentSessionExpiresAt || user.currentSessionExpiresAt < new Date()) {
        return res.status(401).json({ 
          success: false,
          message: "Session mismatch. You have been logged in from another device." 
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const anyAdmin = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    if(
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'SUPER_ADMIN' && 
      req.user.role !== 'SUB_ADMIN'
    ) {
        return res.status(403).json({ message: "Not authorized, not admin" });
    }
    next();
};

export const requireAdmin = (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if(
    req.user.role !== 'ADMIN' &&
    req.user.role !== 'SUPER_ADMIN'
  ) {
    return res.status(403).json({ message: "Not authorized, Admin and Super Admin only" });
  }
  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if(req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: "Not authorized, Super Admin access only" });
  };
  next();
}
