const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "MERN Todo API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

app.use(errorHandler);

module.exports = app;