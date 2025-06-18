const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
   const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not Authorized. Login Again" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from Bearer <token>


    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ assign it correctly to req, not res.body or anything else
        req.userId = tokenDecode.userId;

        next();
    } catch (e) {
        console.error("Token verification error:", e);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { userAuth };
