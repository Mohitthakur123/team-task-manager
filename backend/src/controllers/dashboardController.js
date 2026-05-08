const Task = require("../models/Task");
const Project = require("../models/Project");

const getDashboardData = async (req, res) => {

    try {

        let projects;
        let tasks;

        // ADMIN
        if (req.user.role === "admin") {

            projects = await Project.find({
                createdBy: req.user.id
            });

            tasks = await Task.find({
                assignedBy: req.user.id
            });
        }

        // MEMBER
        else {

            projects = await Project.find({
                members: req.user.id
            });

            tasks = await Task.find({
                assignedTo: req.user.id
            });
        }

        const pendingTasks = tasks.filter(
            (task) => task.status === "To Do"
        );

        const inProgressTasks = tasks.filter(
            (task) => task.status === "In Progress"
        );

        const completedTasks = tasks.filter(
            (task) => task.status === "Done"
        );

        const overdueTasks = tasks.filter(
            (task) =>
                new Date(task.dueDate) < new Date() &&
                task.status !== "Done"
        );

        res.status(200).json({
            success: true,

            dashboard: {
                totalProjects: projects.length,
                totalTasks: tasks.length,
                pendingTasks: pendingTasks.length,
                inProgressTasks: inProgressTasks.length,
                completedTasks: completedTasks.length,
                overdueTasks: overdueTasks.length
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardData
};