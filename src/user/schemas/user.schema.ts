import mongoose, { HydratedDocument } from 'mongoose';
import { IUser, UserRole } from './models/user.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User & Document>;
@Schema({
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class User implements IUser {
  @Prop({ type: String, unique: true })
  id: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.Student,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDocument>('save', function (next) {
  if (!this.id) {
    this.id = (this._id as mongoose.Types.ObjectId).toHexString();
  }
  next();
});

UserSchema.virtual('idVirtual').get(function (this: UserDocument) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
