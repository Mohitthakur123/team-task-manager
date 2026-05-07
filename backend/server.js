const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Team Task Manager API Running"
    });

});
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Team Task Manager API Running");
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});