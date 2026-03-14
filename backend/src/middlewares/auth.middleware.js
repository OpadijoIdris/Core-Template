import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';

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
    
    // Single Active Session Check
    if (decoded.sid) {
      const currentSid = await redis.get(`user_session:${decoded.id}`);
      
      if (!currentSid || currentSid !== decoded.sid) {
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
