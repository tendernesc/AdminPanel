const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();
require('dotenv').config();  // Подключаем dotenv
const SECRET_KEY = process.env.SECRET_KEY;  // Получаем SECRET_KEY из .env

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.json({ message: "User registered!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Вход в систему
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status === "blocked") return res.status(403).json({ error: "User is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    await user.update({ lastLogin: new Date() });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
