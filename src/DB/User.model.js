import mongoose from "mongoose"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import crypto, { randomBytes } from "crypto"

const UserSchema = new mongoose.Schema({
  avatar: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: "https://i.pinimg.com/736x/65/5e/2e/655e2ec7e7850bb2b282e5eec6f90957.jpg",
      localPath: " ",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "PASSWORD IS REQUIRED"]
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
  },
  forgotPasswordToken: {
    type: String
  },
  forgotPasswordExpiry: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10)
  const hash = bcrypt.hash(this.password, salt)
  this.password = hash
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}


UserSchema.methods.createAccessToken = function () {
  return JWT.sign({
    id: this._id,
    username: this.username,
    email: this.email
  },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_DURATION }
  )

}

UserSchema.methods.createRefreshTokens = function () {
  return JWT.sign({
    id: this._id,
  },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_DURATION }
  )

}


UserSchema.methods.createTemporaryToken = function () {
  const unhashedToken = crypto.randomBytes(20).toString("hex")
  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + (20 * 60 * 1000) //20 mins
  return { unhashedToken, hashedToken, tokenExpiry }

}


export const UserModel = mongoose.model("user", UserSchema);
