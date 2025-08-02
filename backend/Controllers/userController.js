import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateToken from "../config/utits.js";
import cloudinary from "../config/cloudinary.js";

// ✅ SignUp Controller
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({
      success: true,
      userData: userWithoutPassword,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    const { password: _, ...userWithoutPassword } = userData._doc;

    res.status(200).json({
      success: true,
      userData: userWithoutPassword,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Check Auth Controller
export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// ✅ Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
