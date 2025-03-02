import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const { name, age, dob } = createUserDto;
    const data = new this.userModel({
      name,
      age,
      dob: new Date(dob),
    });
    const createdUser = await data.save();
    if (!createdUser) {
      return null;
    }
    return createdUser;
  }

  async findAll(): Promise<User[] | []> {
    const users = await this.userModel.find().select('-__v').exec();
    if (users.length === 0) {
      return [];
    }
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).select('-__v').exec();
    if (!user) {
      return null;
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, age, dob } = updateUserDto;
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { name, age, dob }, { new: true })
      .select('-__v')
      .exec();
    if (!updatedUser) {
      return null;
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User | null> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      return null;
    }
    return deletedUser;
  }
}
