const Project = require("../models/Project");
const User = require("../models/User");


// CREATE PROJECT
const createProject = async (req, res) => {

    try {

        const { title, description, members } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create project
        const project = await Project.create({
            title,
            description,
            admin: req.user.id,
            members
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// GET ALL PROJECTS
// GET ALL PROJECTS

const getProjects = async (req, res) => {

    try {

        let projects;

        // ADMIN CAN SEE ALL PROJECTS CREATED BY HIM

        if (req.user.role === "admin") {

            projects = await Project.find({
                admin: req.user.id
            })
            .populate("admin", "name email role")
            .populate("members", "name email role");

        }

        // MEMBERS CAN SEE ASSIGNED PROJECTS

        else {

            projects = await Project.find({
                members: req.user.id
            })
            .populate("admin", "name email role")
            .populate("members", "name email role");

        }

        res.status(200).json({
            success: true,
            projects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET MEMBERS
const getMembers = async (req, res) => {

    try {

        const members = await User.find({
            role: "member"
        }).select("name email");

        res.status(200).json({
            success: true,
            members
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ADD MEMBER TO PROJECT
const addMember = async (req, res) => {

    try {

        const { projectId, userId } = req.body;

        // Check fields
        if (!projectId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and User ID required"
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

        // Only admin can add members
        if (project.admin.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Only admin can add members"
            });
        }

        // Prevent duplicate members
        if (project.members.includes(userId)) {

            return res.status(400).json({
                success: false,
                message: "User already added"
            });
        }

        // Add member
        project.members.push(userId);

        await project.save();

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// UPDATE PROJECT STATUS

const updateProjectStatus = async (req, res) => {

    try {

        const { projectId, status } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // UPDATE STATUS

        project.status = status;

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project status updated",
            project
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// DELETE PROJECT

const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // ONLY ADMIN CAN DELETE

        if (project.admin.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Only admin can delete project"
            });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createProject,
    getProjects,
    addMember,
    getMembers,
    updateProjectStatus,
    deleteProject
};