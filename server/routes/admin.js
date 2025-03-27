const express = require("express");
const { User } = require("../models");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

// Получение всех пользователей
router.get("/users", authenticate, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Блокировка пользователей
router.post("/block", authenticate, async (req, res) => {
  try {
    const { userIds } = req.body; // Получаем массив id пользователей для блокировки
    await User.update({ status: "blocked" }, { where: { id: userIds } });
    res.json({ message: "Users blocked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Разблокировка пользователей
router.post("/unblock", authenticate, async (req, res) => {
  try {
    const { userIds } = req.body;
    await User.update({ status: "active" }, { where: { id: userIds } });
    res.json({ message: "Users unblocked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление пользователей
router.post("/delete", authenticate, async (req, res) => {
  try {
    const { userIds } = req.body;
    await User.destroy({ where: { id: userIds } });
    res.json({ message: "Users deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;