import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      if (!user) {
        return new ErrorResponse('User creation failed', 400, false);
      }
      return new SuccessResponse({ user });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      if (users.length === 0) {
        return new ErrorResponse('No users found', 404, false);
      }
      return new SuccessResponse({ users });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return new ErrorResponse('User not found', 404, false);
      }
      return new SuccessResponse({ user });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        return new ErrorResponse('User not found', 404, false);
      }
      return new SuccessResponse({ message: 'User updated' });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.remove(id);
      if (!user) {
        return new ErrorResponse('User not found', 404, false);
      }
      return new SuccessResponse({ message: 'User deleted' });
    } catch (error) {
      return new ErrorResponse('Internal server error', 500, false);
    }
  }
}
