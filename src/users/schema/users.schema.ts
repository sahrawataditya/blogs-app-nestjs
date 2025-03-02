import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export interface User extends Document {
  firstName: string;
  lastName: string;
  age: number;
  dob: Date;
}
