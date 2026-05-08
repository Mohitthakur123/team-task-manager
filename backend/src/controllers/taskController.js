const Task =
    require("../models/Task");

const Project =
    require("../models/Project");


// CREATE TASK

const task = await Task.create({

  title,
  description,

  project,

  assignedTo,

  priority,

  dueDate,

  createdBy: req.user.id
});


// GET TASKS

const getTasks = async (
    req,
    res
) => {

    try {

        let tasks;

        // ADMIN TASKS

        if (
            req.user.role !== "member"
        ) {

            tasks =
                await Task.find({

                    assignedBy:
                        req.user.id,

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

                    .populate(
                        "assignedBy",
                        "name email"
                    );
        }

        // MEMBER TASKS

        else {

            tasks =
                await Task.find({

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

            message:
                error.message
        });
    }
};


// UPDATE STATUS

const updateTaskStatus =
    async (req, res) => {

        try {

            const {
                taskId,
                status
            } = req.body;

            const task =
                await Task.findById(
                    taskId
                );

            if (!task) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Task not found"
                });
            }

            // CHECK USER ASSIGNED

            const isAssigned =
                task.assignedTo.includes(
                    req.user.id
                );

            if (!isAssigned) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Not authorized"
                });
            }

            // TASK ALREADY DONE

            if (
                task.status === "done"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Task already completed"
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

                message:
                    error.message
            });
        }
    };


module.exports = {

    createTask,

    getTasks,

    updateTaskStatus
};