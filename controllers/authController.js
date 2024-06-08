const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    // console.log("phone", phone);

    // Check if user already exists
    const existingUser = await User.findUnique({ where: { phone } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });

    // console.log("registered user ->", user);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findUnique({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // console.log("jwt -->", jwt);

    res.cookie("jwt", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 3600),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Successfuly logged in",
      user: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
