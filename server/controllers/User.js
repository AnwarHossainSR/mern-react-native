import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
//import cloudinary from "cloudinary";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //const avatar = req.files.avatar.tempFilePath;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    //const mycloud = await cloudinary.v2.uploader.upload(avatar);

    //fs.rmSync("./tmp", { recursive: true });

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "mycloud.public_id",
        url: "mycloud.secure_url",
      },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

    sendToken(
      res,
      user,
      201,
      "OTP sent to your email, please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
