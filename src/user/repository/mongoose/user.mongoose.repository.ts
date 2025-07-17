import { IUser } from 'src/user/schemas/models/user.interface';
import { UserRepository } from '../user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(user: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
  findAll(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }
  findOne(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }
  findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async update(id: string, user: UpdateUserDto): Promise<IUser | undefined> {
    const userData = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
    return userData || undefined;
  }
  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
