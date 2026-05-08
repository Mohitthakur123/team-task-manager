const express = require("express");

const {
    createProject,
    getProjects,
    getMembers,
    addMember,
    updateProjectStatus,
    deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE PROJECT (ADMIN)
router.post(
    "/create",
    protect,
    authorizeRoles("admin"),
    createProject
);


// GET ALL PROJECTS
router.get(
    "/all",
    protect,
    getProjects
);


// GET MEMBERS
router.get(
    "/members",
    protect,
    authorizeRoles("admin"),
    getMembers
);


// ADD MEMBER
router.put(
    "/add-member",
    protect,
    authorizeRoles("admin"),
    addMember
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
    authorizeRoles("admin"),
    deleteProject
);


module.exports = router;