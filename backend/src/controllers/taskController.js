const Task = require("../models/Task");
const Project = require("../models/Project");

/* ================= CREATE TASK ================= */

const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        // VALIDATION

        if (
            !title ||
            !description ||
            !project ||
            !assignedTo ||
            assignedTo.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // CHECK PROJECT

        const existingProject =
            await Project.findById(project);

        if (!existingProject) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // CREATE TASK

        const task = await Task.create({

            title,
            description,

            project,

            assignedTo,

            priority,

            dueDate,

            status: "todo",

            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ================= GET ALL TASKS ================= */

const getTasks = async (req, res) => {

    try {

        let tasks;

        // ADMIN CAN SEE ALL TASKS

        if (req.user.role === "admin") {

            tasks = await Task.find({

                status: {
                    $ne: "done"
                }

            })

            .populate(
                "project",
                "title"
            )

            .populate(
                "assignedTo",
                "name email"
            )

            .sort({
                createdAt: -1
            });

        }

        // MEMBER CAN SEE ONLY THEIR TASKS

        else {

            tasks = await Task.find({

                assignedTo: {
                    $in: [req.user.id]
                }

            })

            .populate(
                "project",
                "title"
            )

            .populate(
                "assignedTo",
                "name email"
            )

            .sort({
                createdAt: -1
            });
        }

        res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ================= UPDATE TASK STATUS ================= */

const updateTaskStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const task =
            await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // IF ALREADY DONE

        if (task.status === "done") {

            return res.status(400).json({
                success: false,
                message:
                    "Task already completed. Contact admin."
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ================= DELETE TASK ================= */

const deleteTask = async (req, res) => {

    try {

        const task =
            await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ================= EXPORT ================= */

module.exports = {

    createTask,

    getTasks,

    updateTaskStatus,

    deleteTask
};