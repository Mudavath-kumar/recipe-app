import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  image?: string
  favorites: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
