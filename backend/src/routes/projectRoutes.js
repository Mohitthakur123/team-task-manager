const express = require("express");

const {
    createProject,
    getProjects,
    addMember,
    getMembers,
    updateProjectStatus
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE PROJECT (ADMIN ONLY)

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


// GET TEAM MEMBERS

router.get(
    "/members",
    protect,
    authorizeRoles("admin"),
    getMembers
);


// UPDATE PROJECT STATUS

router.put(
    "/status",
    protect,
    updateProjectStatus
);


// ADD MEMBER

router.put(
    "/add-member",
    protect,
    authorizeRoles("admin"),
    addMember
);

module.exports = router;