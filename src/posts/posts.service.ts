import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './repository/post.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}
  async create(createPostDto: CreatePostDto) {
    return this.postRepository.create(createPostDto);
  }

  async findAll(limit: number, page: number) {
    return this.postRepository.findAll(limit, page);
  }

  async findAllPublished() {
    return this.postRepository.findAllPublished();
  }

  async findOne(id: string) {
    try {
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new NotFoundException(`Post com "${id}" não encontrado.`);
      }

      return post;
    } catch (error) {
      throw error;
      throw new NotFoundException(`Post com ID "${id}" não encontrado.`);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.postRepository.update(id, updatePostDto);
  }

  async search(term: string) {
    return this.postRepository.search(term);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.postRepository.remove(id);
  }
}
