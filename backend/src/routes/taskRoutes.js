const express = require("express");

const {
    createTask,
    getTasks,
    updateTaskStatus
} = require("../controllers/taskController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


// CREATE TASK
router.post(
    "/create",
    protect,
    createTask
);


// GET TASKS
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