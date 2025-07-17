import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser } from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract create(user: CreateUserDto): Promise<IUser>;
  abstract findAll(): Promise<IUser[]>;
  abstract findOne(id: string): Promise<IUser | null>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract update(id: string, user: UpdateUserDto): Promise<IUser | undefined>;
  abstract remove(id: string): Promise<void>;
}
