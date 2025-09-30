const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  //  Make sure cookie-parser is used in server.js
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    //  Refresh the token if it's about to expire (< 5 mins)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const renewalThreshold = 5 * 60 * 1000; // 5 minutes

    if (expirationTime - currentTime < renewalThreshold) {
      const newToken = jwt.sign({ _id: decoded._id }, process.env.JWT_SECRET, {
        expiresIn: "30m",
      });

      res.cookie("jwt", newToken, {
        httpOnly: true,
        maxAge: 1800000, // 30 min
        secure: false, //  change to true in production (HTTPS)
        sameSite: "Lax",
      });
    }

    //  Attach userId to the request object for downstream routes
    req.user = { _id: decoded._id };
    next();
  });
};

module.exports = {
  authenticateToken,
};
