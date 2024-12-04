const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const getAllUsers = (req, res) => {
  try {
    const users = User.getAll();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

const createUser = (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;
    const result = User.insertWithHash(name, email, password, user_type);
    res
      .status(201)
      .json({
        message: "User created successfully",
        user_id: result.lastInsertRowid,
      });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = User.getById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, user_type } = req.body;
    const result = User.update(id, name, email, password, user_type);
    if (result.changes > 0) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const result = User.delete(id);
    if (result.changes > 0) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const secretKey = "my_secret_key";


const signup = async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body;

        // Call User.findByEmail to check for existing user
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Insert user into the database
        const result = await User.insertWithHash(name, email, password, user_type);

        // Generate a JWT token
        const token = jwt.sign(
            { id: result.lastInsertRowid, email, user_type },
            secretKey,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error signing up', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user credentials
        const user = await User.validatePassword(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, user_type: user.user_type },
            secretKey,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  signup,
  login,
};
