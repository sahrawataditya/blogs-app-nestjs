import { Schema, Document } from 'mongoose';

export const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export interface Post extends Document {
  title: string;
  description: string;
  postedBy: string;
  image?: string;
}
