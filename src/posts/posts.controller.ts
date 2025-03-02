import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { extractPublicId } from 'cloudinary-build-url';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        createPostDto.image = imageUrl;
      }
      const post = await this.postsService.create(createPostDto);
      if (!post) {
        return new ErrorResponse('Post creation failed', 400, false);
      }
      return new SuccessResponse({ post });
    } catch (error) {
      console.log(error);
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Get()
  async findAll() {
    try {
      const { posts, pendingPosts } = await this.postsService.findAll();
      if (posts.length === 0) {
        return new ErrorResponse('No posts found', 404, false);
      }
      return new SuccessResponse({ posts, pendingPosts });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const post = await this.postsService.findOne(id);
      if (!post) {
        return new ErrorResponse('Post not found', 404, false);
      }
      return new SuccessResponse({ post });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatePostDto.image = imageUrl;
      }
      const updatedPost = await this.postsService.update(id, updatePostDto);
      if (!updatedPost) {
        return new ErrorResponse('Post not found', 404, false);
      }
      return new SuccessResponse({
        post: updatedPost,
        message: 'Post updated successfully',
      });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedPost = await this.postsService.remove(id);
      if (!deletedPost) {
        return new ErrorResponse('Post not found', 404, false);
      }
      if (deletedPost.image) {
        await this.cloudinaryService.deleteImage(
          extractPublicId(deletedPost.image),
        );
      }
      return new SuccessResponse({ message: 'Post deleted successfully' });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }
}
