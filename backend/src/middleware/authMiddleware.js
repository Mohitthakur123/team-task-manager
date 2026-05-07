const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

    try {

        let token = req.headers.authorization;

        // Check token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        // Remove Bearer
        token = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user info in request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = protect;