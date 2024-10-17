import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, "usdzvsedhu9swdivewdawevdiawked");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};


export const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, "jhdweudhuweigdiwfegd87t3e62ye3y2qeq");
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

