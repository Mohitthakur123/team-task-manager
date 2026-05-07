const express = require("express");

const {
    createProject,
    getProjects,
    addMember
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
// ADD MEMBER
router.put(
    "/add-member",
    protect,
    authorizeRoles("admin"),
    addMember
);

module.exports = router;