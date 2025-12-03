import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, models } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  updatedAt?: Date;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) { 
      this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = models?.User ||  mongoose.model<IUser>("User", userSchema);
