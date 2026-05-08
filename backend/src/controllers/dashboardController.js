const Task =
    require("../models/Task");

const Project =
    require("../models/Project");

const getDashboardData =
    async (req, res) => {

        try {

            // TOTAL PROJECTS

            const totalProjects =
                await Project.countDocuments({
                    createdBy: req.user.id
                });

            // TOTAL TASKS

            const totalTasks =
                await Task.countDocuments({
                    assignedBy: req.user.id
                });

            // COMPLETED TASKS

            const completedTasks =
                await Task.countDocuments({

                    assignedBy:
                        req.user.id,

                    status: "done"
                });

            // PENDING TASKS

            const pendingTasks =
                await Task.countDocuments({

                    assignedBy:
                        req.user.id,

                    status: {
                        $ne: "done"
                    }
                });

            // OVERDUE TASKS

            const overdueTasks =
                await Task.find({

                    assignedBy:
                        req.user.id,

                    dueDate: {
                        $lt: new Date()
                    },

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
                        "name"
                    );

            res.status(200).json({

                success: true,

                dashboard: {

                    totalProjects,

                    totalTasks,

                    completedTasks,

                    pendingTasks,

                    overdueTasksCount:
                        overdueTasks.length,

                    overdueTasks
                }
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };

module.exports = {
    getDashboardData
};