const Task = require("../models/Task");
const Project = require("../models/Project");


// CREATE TASK
const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            projectId,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        if (
            !title ||
            !description ||
            !projectId ||
            !assignedTo ||
            !dueDate
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const project =
            await Project.findById(projectId);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // ONLY PROJECT CREATOR
        if (
            project.createdBy.toString()
            !== req.user.id
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // MEMBER MUST EXIST IN TEAM
        if (
            !project.members.includes(
                assignedTo
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "User is not project member"
            });
        }

        const task = await Task.create({
            title,
            description,
            project: projectId,
            assignedTo,
            assignedBy: req.user.id,
            priority,
            dueDate,
            status: "todo"
        });

        res.status(201).json({
            success: true,
            message:
                "Task created successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// GET TASKS
const getTasks = async (req, res) => {

    try {

        let tasks;

        // ADMIN
        if (req.user.role === "admin") {

            tasks = await Task.find({
                assignedBy: req.user.id
            })
            .populate("project", "title")
            .populate(
                "assignedTo",
                "name email"
            );
        }

        // MEMBER
        else {

            tasks = await Task.find({
                assignedTo: req.user.id
            })
            .populate("project", "title")
            .populate(
                "assignedBy",
                "name email"
            );
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



// UPDATE TASK STATUS
const updateTaskStatus = async (
    req,
    res
) => {

    try {

        const { taskId, status } = req.body;

        const task =
            await Task.findById(taskId);

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // ONLY ASSIGNED MEMBER
        if (
            task.assignedTo.toString()
            !== req.user.id
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            success: true,
            message:
                "Task updated successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTaskStatus
};