const Project =
  require("../models/Project");

const Task =
  require("../models/Task");

exports.getDashboardData =
  async (req, res) => {

    try {

      let totalProjects = 0;

      let totalTasks = 0;

      let pendingTasks = 0;

      let completedTasks = 0;

      let overdueTasks = 0;

      if (req.user.role === "admin") {

        totalProjects =
          await Project.countDocuments();

        totalTasks =
          await Task.countDocuments();

        pendingTasks =
          await Task.countDocuments({
            status: "todo"
          });

        completedTasks =
          await Task.countDocuments({
            status: "done"
          });

        overdueTasks =
          await Task.countDocuments({
            status: "overdue"
          });

      } else {

        totalTasks =
          await Task.countDocuments({

            assignedTo:
              req.user.id
          });

        pendingTasks =
          await Task.countDocuments({

            assignedTo:
              req.user.id,

            status: "todo"
          });

        completedTasks =
          await Task.countDocuments({

            assignedTo:
              req.user.id,

            status: "done"
          });

        overdueTasks =
          await Task.countDocuments({

            assignedTo:
              req.user.id,

            status: "overdue"
          });
      }

      res.status(200).json({

        success: true,

        totalProjects,

        totalTasks,

        pendingTasks,

        completedTasks,

        overdueTasks
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message
      });
    }
  };