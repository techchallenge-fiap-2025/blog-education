import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostMongooseRepository } from './repository/mongoose/post.mongoose.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Post, PostDocument, PostSchema } from './schemas/posts.schema';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from './repository/post.repository';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService integration tests', () => {
  let module: TestingModule;
  let service: PostsService;
  let mongod: MongoMemoryServer;
  let postModel: Model<PostDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      ],
      providers: [
        PostsService,
        PostMongooseRepository,
        { provide: PostRepository, useExisting: PostMongooseRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await postModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    const created = await service.create(postInput);
    expect(created).toHaveProperty('id');
    expect(created.title).toBe('Integration Test');
  });

  it('should retun error when creating a post without title', async () => {
    const postInput: CreatePostDto = {
      title: '',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    await expect(service.create(postInput)).rejects.toThrow(
      'Post validation failed: title: Path `title` is required.',
    );
  });

  it('should find all posts', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    await service.create(postInput);
    const posts = await service.findAll(10, 1);
    expect(posts).toHaveLength(1);
  });

  it('should find one post by id', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    const created = await service.create(postInput);
    const one = await service.findOne(created.id);
    expect(one).not.toBeNull();
    expect(one!.title).toBe('Integration Test');
  });

  it('should return error when finding one post by invalid id', async () => {
    await expect(service.findOne('1')).rejects.toThrow(
      'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "Post"',
    );
  });

  it('should update a valid post', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    const created = await service.create(postInput);
    const updated = await service.update(created.id, {
      title: 'Updated Title',
    });
    expect(updated).toHaveProperty('id');
    expect(updated?.title).toBe('Updated Title');
  });

  it('should delete a valid post', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    const created = await service.create(postInput);
    const deleted = await service.remove(created.id);
    expect(deleted).toBeUndefined();
  });

  it('should find one post by title or description', async () => {
    const postInput: CreatePostDto = {
      title: 'Integration Test',
      description: 'Testing with real mongodb, but in memory',
      image: 'img.png',
      isPublished: true,
    };
    const created = await service.create(postInput);
    const searchPost = await service.search(created.title);
    expect(searchPost).not.toBeNull();
    expect(searchPost[0].title).toBe('Integration Test');
    expect(searchPost[0].description).toBe(
      'Testing with real mongodb, but in memory',
    );
  });
});
