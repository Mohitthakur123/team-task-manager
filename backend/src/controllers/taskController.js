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
        const validPriorities = [
            "low",
            "medium",
            "high"
        ];

        if (
            priority &&
            !validPriorities.includes(priority)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid priority value"
            });
        }
        // Validation
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

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Only project admin can create tasks
        if (project.admin.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Only admin can create tasks"
            });
        }

        // Check assigned user belongs to project
        if (!project.members.includes(assignedTo)) {

            return res.status(400).json({
                success: false,
                message: "User is not a project member"
            });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            project: projectId,
            assignedTo,
            assignedBy: req.user.id,
            priority,
            dueDate
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

        const tasks = await Task.find({
            assignedTo: req.user.id
        })
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

        const { taskId, status } = req.body;
        const validStatuses = [
            "todo",
            "in-progress",
            "done"
        ];

        if (!validStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        // Find task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Only assigned user can update
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