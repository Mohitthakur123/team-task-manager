const Task = require("../models/Task");

const getDashboardData = async (req, res) => {

    try {

        // Total tasks
        const totalTasks = await Task.countDocuments();

        // Completed tasks
        const completedTasks = await Task.countDocuments({
            status: "done"
        });

        // Pending tasks
        const pendingTasks = await Task.countDocuments({
            status: "todo"
        });

        // In-progress tasks
        const inProgressTasks = await Task.countDocuments({
            status: "in-progress"
        });

        // Overdue tasks
        const overdueTasks = await Task.find({
            dueDate: { $lt: new Date() },
            status: { $ne: "done" }
        });

        // Tasks grouped by user
        const tasksPerUser = await Task.aggregate([
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
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasksCount: overdueTasks.length,
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