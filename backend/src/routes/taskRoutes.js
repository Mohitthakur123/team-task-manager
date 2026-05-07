const express = require("express");

const {
    createTask,
    getTasks,
    updateTaskStatus
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE TASK (Admin Only)
router.post(
    "/create",
    protect,
    authorizeRoles("admin"),
    createTask
);


// GET MY TASKS
router.get(
    "/my-tasks",
    protect,
    getTasks
);


// UPDATE TASK STATUS
router.put(
    "/update-status",
    protect,
    updateTaskStatus
);


module.exports = router;