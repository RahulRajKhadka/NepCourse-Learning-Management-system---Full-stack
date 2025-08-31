import jwt from "jsonwebtoken";

const genToken = (userId) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default genToken;
