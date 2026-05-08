const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {

    createTask,

    getTasks,

    updateTaskStatus,

    deleteTask

} = require(
    "../controllers/taskController"
);

/* ================= CREATE TASK ================= */

router.post(
    "/create",
    authMiddleware,
    createTask
);

/* ================= GET TASKS ================= */

router.get(
    "/my-tasks",
    authMiddleware,
    getTasks
);

/* ================= UPDATE STATUS ================= */

router.put(
    "/update-status/:id",
    authMiddleware,
    updateTaskStatus
);

/* ================= DELETE TASK ================= */

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteTask
);

module.exports = router;