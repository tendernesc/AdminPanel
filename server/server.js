const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(bodyParser.json());

// Подключаем роуты
app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes); // Подключаем маршруты админ-панели

// Статическая обработка ошибок
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Обработка ошибок
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    error: process.env.NODE_ENV === "development" ? error : {},
  });
});

// Порт для сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
