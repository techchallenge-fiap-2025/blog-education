import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Post {
  @Prop({ type: String, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type PostDocument = mongoose.HydratedDocument<Post & Document>;

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre<PostDocument>('save', function (next) {
  if (!this.id) {
    this.id = (this._id as mongoose.Types.ObjectId).toHexString();
  }
  next();
});

PostSchema.virtual('idVirtual').get(function (this: PostDocument) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
