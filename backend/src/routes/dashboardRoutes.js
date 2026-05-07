const express = require("express");

const {
    getDashboardData
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Admin only dashboard
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getDashboardData
);

module.exports = router;