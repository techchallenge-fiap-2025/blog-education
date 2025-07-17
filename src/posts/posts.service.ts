import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './repository/post.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}
  create(createPostDto: CreatePostDto) {
    return this.postRepository.create(createPostDto);
  }

  findAll(limit: number, page: number) {
    return this.postRepository.findAll(limit, page);
  }

  findAllPublished() {
    return this.postRepository.findAllPublished();
  }

  findOne(id: string) {
    return this.postRepository.findOne(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }
  search(term: string) {
    return this.postRepository.search(term);
  }

  remove(id: string) {
    return this.postRepository.remove(id);
  }
}
