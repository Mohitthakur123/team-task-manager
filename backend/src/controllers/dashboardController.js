const Task = require("../models/Task");
const Project = require("../models/Project");

const getDashboardData = async (req, res) => {

    try {

        // Total Projects
        const totalProjects = await Project.countDocuments({
            admin: req.user.id
        });

        // Total Tasks
        const totalTasks = await Task.countDocuments({
            assignedBy: req.user.id
        });

        // Completed Tasks
        const completedTasks = await Task.countDocuments({
            assignedBy: req.user.id,
            status: "Done"
        });

        // Pending Tasks
        const pendingTasks = await Task.countDocuments({
            assignedBy: req.user.id,
            status: "To Do"
        });

        // In Progress Tasks
        const inProgressTasks = await Task.countDocuments({
            assignedBy: req.user.id,
            status: "In Progress"
        });

        // Overdue Tasks
        const overdueTasks = await Task.countDocuments({
            assignedBy: req.user.id,
            dueDate: { $lt: new Date() },
            status: { $ne: "Done" }
        });

        // Tasks Per User
        const tasksPerUser = await Task.aggregate([
            {
                $match: {
                    assignedBy: req.user._id
                }
            },
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,

            dashboard: {
                totalProjects,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
                tasksPerUser
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