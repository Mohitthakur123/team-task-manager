const express = require("express");

const {
    createProject,
    getProjects,
    addMember,
    getMembers
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE PROJECT (Admin Only)
router.post(
    "/create",
    protect,
    authorizeRoles("admin"),
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

module.exports = router;