const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  login: (req, res) => {
    const { email, password } = req.body;

    userModel.loginUser(email, async (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          const user = results[0];

          const passwordMatch = await bcrypt.compare(password, user.Password);
          if (!passwordMatch) {
            res.status(401).json({ error: "Invalid Password!" });
          } else {
            const username = user.Username;
            const token = jwt.sign(
              { username: user.Username, role: user.Role_ID },
              process.env.SECRET,
              { expiresIn: "8h" }
            );
            res.status(200).json({ username, token });
          }
        } else {
          res.status(401).json({ error: "Invalid Email!" });
        }
      }
    });
  },

  signup: async (req, res) => {
    const { name, email, username, password, contactInfo } = req.body;
    const role = 2;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    userModel.createUser(
      name,
      email,
      username,
      hash,
      role,
      contactInfo,
      (err) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const token = jwt.sign({ username, role }, process.env.SECRET, {
            expiresIn: "8h",
          });
          res.status(201).json({ username, token });
        }
      }
    );
  },

  checkEmail: (req, res) => {
    const email = req.query.email;

    userModel.checkEmail(email, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const count = results[0].count;
        res.status(200).json({ unique: count === 0 });
      }
    });
  },

  checkUsername: (req, res) => {
    const username = req.query.username;

    userModel.checkUsername(username, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const count = results[0].count;
        res.status(200).json({ unique: count === 0 });
      }
    });
  },

  getUserDetails: (req, res) => {
    const { username } = req.params;

    userModel.getUserDetails(username, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      } else {
        res.status(200).json(result[0]);
      }
    });
  },
};
