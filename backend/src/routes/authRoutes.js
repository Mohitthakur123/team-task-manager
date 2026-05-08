const express = require("express");

const {
    signup,
    login,
    getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// SIGNUP
router.post(
    "/signup",
    signup
);


// LOGIN
router.post(
    "/login",
    login
);


// PROFILE
router.get(
    "/profile",
    protect,
    getProfile
);


// ADMIN ONLY TEST ROUTE
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