const Project = require("../models/Project");


// CREATE PROJECT
const createProject = async (req, res) => {

    try {

        const { title, description } = req.body;

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
            members: [req.user.id]
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
const getProjects = async (req, res) => {

    try {

        const projects = await Project.find({
            members: req.user.id
        })
        .populate("admin", "name email")
        .populate("members", "name email");

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

module.exports = {
    createProject,
    getProjects,
    addMember
};