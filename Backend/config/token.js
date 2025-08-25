import jwt from "jsonwebtoken";

const genToken = (userId) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET)
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      },
    );
  });
};

export default genToken;
