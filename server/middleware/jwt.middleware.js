const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    const authorizationArray = req.headers.authorization.split(" ");
    // authorizationArray[0] == "Bearer"
    // authorizationArray[1] == The JWT (Token)
    if (authorizationArray[0] === "Bearer" && authorizationArray[1]) {
      const myToken = authorizationArray[1];
      try {
        const decodedToken = jwt.verify(myToken, process.env.TOKEN_SECRET);
        req.payload = decodedToken;
        next();
      } catch (error) {
        res.status(400).json({ message: "Invalid token" });
      }
    }
  } else {
    res.status(400).json({ message: "No token" });
  }
}
module.exports = { isAuthenticated };
