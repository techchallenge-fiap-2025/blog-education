import { IPost } from 'src/posts/schemas/models/posts.interface';
import { PostRepository } from '../post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../schemas/posts.schema';
import { Model } from 'mongoose';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';

export class PostMongooseRepository implements PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}
  create(post: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }
  findAllPublished(): Promise<IPost[]> {
    return this.postModel.find({ isPublished: true }).exec();
  }
  findAll(limit: number, page: number): Promise<IPost[]> {
    const offSet = (page - 1) * limit;
    return this.postModel.find().skip(offSet).limit(limit).exec();
  }
  findOne(id: string): Promise<IPost | null> {
    return this.postModel.findById(id).exec();
  }
  async update(id: string, post: UpdatePostDto): Promise<IPost | undefined> {
    const newPost = await this.postModel.findOneAndUpdate({ _id: id }, post, {
      new: true,
    });
    return newPost || undefined;
  }
  async remove(id: string): Promise<void> {
    await this.postModel.deleteOne({ _id: id }).exec();
  }
  async search(term: string): Promise<IPost[]> {
    const regex = new RegExp(term, 'i');
    const docs = await this.postModel
      .find({ $or: [{ title: regex }, { description: regex }] })
      .exec();

    if (!docs.length) {
      throw new NotFoundException(`Nenhum post encontrado para "${term}"`);
    }

    return docs.map((d) => d.toObject());
  }
}
