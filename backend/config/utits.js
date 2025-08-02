import jwt from "jsonwebtoken";
 const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d", // optional: token expires in 7 days
    });
    return token;
  } catch (error) {
    console.error("JWT Token Generation Error:", error.message);
    return null; // return null or throw error if needed
  }
};

export default generateToken;
