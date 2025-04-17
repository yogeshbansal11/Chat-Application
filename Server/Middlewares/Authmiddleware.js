import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  const token = req.cookies.jwt;
  console.log({ token });

  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      console.error("JWT verify error:", err); // Log the error for better debugging
      return res.status(403).send("Token is not valid");
    }

    // Ensure the payload contains the userId
    if (!payload || !payload.userId) {
      return res.status(403).send("Token does not contain user ID");
    }

    req.userId = payload.userId;
    next();
  });
};
