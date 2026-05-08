const express = require("express");

const {
    createProject,
    getProjects,
    getMembers,
    addMemberToProject,
    updateProjectStatus,
    deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE PROJECT
router.post(
    "/create",
    protect,
    createProject
);


// GET PROJECTS
router.get(
    "/all",
    protect,
    getProjects
);


// GET MEMBERS
router.get(
    "/members",
    protect,
    getMembers
);


// ADD MEMBER TO PROJECT
router.put(
    "/add-member",
    protect,
    addMemberToProject
);


// UPDATE PROJECT STATUS
router.put(
    "/:id",
    protect,
    updateProjectStatus
);


// DELETE PROJECT
router.delete(
    "/:id",
    protect,
    deleteProject
);

module.exports = router;