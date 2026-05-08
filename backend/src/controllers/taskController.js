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

        const project = await Project.findById(projectId);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // ONLY PROJECT CREATOR
        if (project.createdBy.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Only admin can create task"
            });
        }

        // CHECK MEMBER EXISTS
        if (!project.members.includes(assignedTo)) {

            return res.status(400).json({
                success: false,
                message: "User is not project member"
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



// GET TASKS
const getTasks = async (req, res) => {

    try {

        let tasks;

        // ADMIN CAN VIEW CREATED TASKS
        if (req.user.role === "admin") {

            tasks = await Task.find({
                assignedBy: req.user.id
            });

        }

        // MEMBER CAN VIEW ASSIGNED TASKS
        else {

            tasks = await Task.find({
                assignedTo: req.user.id
            });
        }

        tasks = await tasks
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("assignedBy", "name email");

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
const updateTaskStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const validStatuses = [
            "To Do",
            "In Progress",
            "Done"
        ];

        if (!validStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        // Find task
        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Only assigned member can update
        if (task.assignedTo.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "You can update only your tasks"
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task status updated",
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