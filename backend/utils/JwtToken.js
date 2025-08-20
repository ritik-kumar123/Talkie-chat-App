import jwt from "jsonwebtoken";

export const generateToken = async (user,message,statusCode,res) => {
    try {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development" ? true : false,
          sameSite: "Strict",
          maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 1000,
        })
        .json({
          success: true,
          message,
          token,
        });
    } catch (error) {
      console.log("token error");
    }
};
