const express = require("express");

const {
    signup,
    login
} = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);
router.get("/profile", protect, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected route accessed",
        user: req.user
    });

});
router.get(
    "/admin-only",
    protect,
    authorizeRoles("admin"),
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Welcome Admin"
        });

    }
);

module.exports = router;