const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  login: (req, res) => {
    const { email, password, portalType } = req.body;

    userModel.loginUser(email, async (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ 
          success: false,
          error: "Internal server error" 
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid email or password" 
        });
      }

      const user = results[0];
      
      // Verify portal access
      const requestedRole = portalType === 'Admin' ? 1 : 2;
      if (user.Role_ID !== requestedRole) {
        return res.status(403).json({ 
          success: false,
          error: `Access denied. Please use the ${user.Role_Name} portal` 
        });
      }

      try {
        const passwordMatch = await bcrypt.compare(password, user.Password);
        if (!passwordMatch) {
          return res.status(401).json({ 
            success: false,
            error: "Invalid email or password" 
          });
        }

        const token = jwt.sign(
          { 
            userId: user.User_ID,
            username: user.Username,
            role: user.Role_ID,
            roleName: user.Role_Name
          },
          process.env.SECRET,
          { expiresIn: "8h" }
        );

        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.User_ID,
            name: user.Name,
            email: user.Email,
            username: user.Username,
            role: user.Role_ID,
            roleName: user.Role_Name,
            contactInfo: user.ContactInfo
          }
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
          success: false,
          error: "Internal server error" 
        });
      }
    });
  },

  signup: async (req, res) => {
    const { name, email, username, password, role, contactInfo } = req.body;

    try {
      // Validate role
      if (role == 1) { // Admin role
        // Add additional validation for admin signup if needed
        const adminCode = req.body.adminCode;
        if (adminCode !== process.env.ADMIN_SIGNUP_CODE) {
          return res.status(403).json({
            success: false,
            error: "Invalid admin registration code"
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      userModel.createUser({
        name,
        email,
        username,
        password: hashedPassword,
        role,
        contactInfo
      }, (err, result) => {
        if (err) {
          console.error("Signup error:", err);
          const errorMsg = err.message.includes('already exists') 
            ? err.message 
            : "Registration failed. Please try again.";
          return res.status(400).json({
            success: false,
            error: errorMsg
          });
        }

        const token = jwt.sign(
          { 
            userId: result.insertId,
            username,
            role,
            name,
            email
          },
          process.env.SECRET,
          { expiresIn: "8h" }
        );

        res.status(201).json({
          success: true,
          token,
          user: {
            id: result.insertId,
            name,
            email,
            username,
            role,
            contactInfo
          }
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  },

  getUserProfile: (req, res) => {
    const userId = req.user.userId;

    userModel.getUserDetails(userId, (err, result) => {
      if (err) {
        console.error("Profile error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to fetch user profile"
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }

      res.status(200).json({
        success: true,
        user: result[0]
      });
    });
  },

  updateProfile: (req, res) => {
    const userId = req.user.userId;
    const { name, email, contactInfo } = req.body;

    userModel.updateUser(userId, { name, email, contactInfo }, (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to update profile"
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully"
      });
    });
  },

  checkEmail: (req, res) => {
    const email = req.query.email;

    userModel.checkEmail(email, (err, results) => {
      if (err) {
        console.error("Email check error:", err);
        return res.status(500).json({
          success: false,
          error: "Internal server error"
        });
      }

      res.status(200).json({
        success: true,
        isAvailable: results[0].count === 0
      });
    });
  },

  checkUsername: (req, res) => {
    const username = req.query.username;

    userModel.checkUsername(username, (err, results) => {
      if (err) {
        console.error("Username check error:", err);
        return res.status(500).json({
          success: false,
          error: "Internal server error"
        });
      }

      res.status(200).json({
        success: true,
        isAvailable: results[0].count === 0
      });
    });
  },
  // In controllers/userController.js
  getUserDetails : (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    db.getUserDetails(userId, (error, results) => {
      if (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({
          success: false,
          message: 'Error fetching user details',
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: results[0]
      });
    });
  }
};
