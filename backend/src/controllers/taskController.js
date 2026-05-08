const Task =
    require("../models/Task");

const Project =
    require("../models/Project");


// CREATE TASK

const createTask = async (
    req,
    res
) => {

    try {

        const {
            title,
            description,
            projectId,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        // VALIDATION

        if (
            !title ||
            !description ||
            !projectId ||
            !assignedTo ||
            assignedTo.length === 0 ||
            !dueDate
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All fields are required"
            });
        }

        // FIND PROJECT

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {

            return res.status(404).json({
                success: false,
                message:
                    "Project not found"
            });
        }

        // CHECK ALL MEMBERS BELONG TO PROJECT

       const allMembersValid =
    assignedTo.every(
        (memberId) =>

            project.members.some(
                (member) =>

                    member.toString()
                    === memberId
            )
    );

        if (!allMembersValid) {

            return res.status(400).json({
                success: false,
                message:
                    "Some users are not project members"
            });
        }

        // CREATE TASK

        const task =
            await Task.create({

                title,

                description,

                project: projectId,

                assignedTo,

                assignedBy:
                    req.user.id,

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

            message:
                error.message
        });
    }
};


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