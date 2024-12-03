import pool from "../model/db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
dotenv.config();

class AuthController {
  async postLogin(req, res) {
    const { email, password } = req.body;
    console.log(email, password, "body");

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      console.log("result", result);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found with this email" });
      } else {
        const user = result.rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch, "isPasswordMatch");
        if (!isPasswordMatch) {
          return res.status(401).json({ message: "Invalid password" });
        } else {
          const payload = {
            email:user.email,
            password:user.password
          }

          const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: '1h'
          })
          return res.status(200).json({
            message: "Login successful!",
            token:token
          });
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkUserExists(req, res) {
    const { email } = req.query;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length > 0) {
        return res.status(200).json(true);
      }
      return res.status(200).json(false);
    } catch (error) {
      console.error("Error checking user existence:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async sendOtp(req, res) {
    const { email } = req.body;

    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(`Generated OTP for ${email}: ${otp}`);

      req.session.otp = otp;
      console.log(req.session.otp, "session otp");

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.OTP_SENDER_EMAIL,
          pass: process.env.OTP_SENDER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.OTP_SENDER_EMAIL,
        to: email,
        subject: "Your OTP ",
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, name, email, password } = req.body;

    console.log(name, email, password, otp, "otp body");
    console.log(otp, "from body");
    console.log(req.session, "session");
    console.log(`Stored OTPs:`, req.session.otp);

    const storedOtp = req.session.otp;

    if (storedOtp && storedOtp.toString() === otp.toString()) {
      delete req.session.otp;

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertResult = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hashedPassword]
      );

      return res.status(201).json({
        success: true,
        message: "Signup successful!",
        user: insertResult.rows[0],
      });
    } else {
      res.status(404).json({ success: false, message: "Invalid OTP!" });
    }
  }
}

export default AuthController;
