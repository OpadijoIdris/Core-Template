import { 
            loginUser,
            registerUser,
            forgotPasswordService,
            resetPasswordService,
            changePasswordService
 } 
 from "../services/auth.services.js";
 import { getUserService } from "../services/user.services.js";
 import prisma from "../config/postgres.js";
 import jwt from "jsonwebtoken";
 import crypto from "crypto";

 export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser({ email, password });

    res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const login = async (req, res) => {
    try {
        const { email } = req.body;

        const { user } = await loginUser(req.body);

        const sid = crypto.randomUUID(); // Unique Session ID
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, sid },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentSessionSid: sid,
            currentSessionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({
            success: true,
            message: "Login Successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
        
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


 export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.decode(token);
      const exp = decoded?.exp;
      if (exp) {
        await prisma.blacklistedToken.upsert({
          where: { token },
          update: { expiresAt: new Date(exp * 1000) },
          create: { token, expiresAt: new Date(exp * 1000) }
        });
      }

      if (decoded?.id) {
        await prisma.user.update({
          where: { id: decoded.id },
          data: {
            currentSessionSid: null,
            currentSessionExpiresAt: null,
          }
        });
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { tokenOrCode, newPassword } = req.body;

    if (!tokenOrCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token/code and new password are required"
      });
    }

    const result = await resetPasswordService(tokenOrCode, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    const result = await changePasswordService(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Fetch the complete user from database including avatarUrl
    const fullUser = await getUserService(user.id);

    return res.status(200).json({
      success: true,
      user: fullUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

