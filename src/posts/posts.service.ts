import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schema/posts.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private postModel: Model<Post>) {}
  async create(createPostDto: CreatePostDto): Promise<Post | null> {
    const post = await this.postModel.create(createPostDto);
    if (!post) {
      return null;
    }
    return post;
  }

  async findAll(): Promise<
    | { posts: Post[]; pendingPosts: number }
    | { posts: []; pendingPosts?: number }
  > {
    const posts = await this.postModel
      .find({}, '-__v')
      .populate('postedBy', '-_id -__v')
      .select('-__v')
      .exec();

    if (posts.length === 0) {
      return { posts: [] };
    }
    const pendingPosts = await this.postModel.countDocuments({
      status: 'pending',
    });
    return { posts, pendingPosts };
  }

  async findOne(id: string): Promise<Post | null> {
    const post = await this.postModel
      .findById(id, '-__v')
      .populate('postedBy', '-__v -_id')
      .exec();
    if (!post) {
      return null;
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true, runValidators: true },
    );
    if (!updatedPost) {
      return null;
    }
    return updatedPost;
  }

  async remove(id: string): Promise<Post | null> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      return null;
    }
    return deletedPost;
  }
}
