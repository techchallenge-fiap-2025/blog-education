import { UpdatePostDto } from '../dto/update-post.dto';
import { IPost } from '../schemas/models/posts.interface';
import { CreatePostDto } from '../dto/create-post.dto';

export abstract class PostRepository {
  abstract create(post: CreatePostDto): Promise<IPost>;
  abstract findAllPublished(): Promise<IPost[]>; //For students
  abstract findAll(limit: number, page: number): Promise<IPost[]>; //For Teachers
  abstract findOne(id: string): Promise<IPost | null>;
  abstract update(id: string, post: UpdatePostDto): Promise<IPost | undefined>;
  abstract remove(id: string): Promise<void>;
  abstract search(term: string): Promise<IPost[]>;
}
