import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserMongooseRepository } from './repository/mongoose/user.mongoose.repository';
import { UserRepository } from './repository/user.repository';
import { UserRole } from './schemas/models/user.interface';

describe('UserService integration tests', () => {
  let service: UserService;
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        UserService,
        UserMongooseRepository,
        { provide: UserRepository, useExisting: UserMongooseRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user student and teacher and find both', async () => {
    const userStudent = await service.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });

    const userTeacher = await service.create({
      name: 'John Doe Teacher',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Teacher,
      isActive: true,
    });

    const entityStudent = await service.findOne(userStudent.id);
    const entityTeacher = await service.findOne(userTeacher.id);

    expect(entityStudent).not.toBeNull();
    expect(entityTeacher).not.toBeNull();
    expect(entityStudent?.name).toBe('John Doe');
    expect(entityTeacher?.name).toBe('John Doe Teacher');
  });

  it('should return error when creating a user without name', async () => {
    await expect(
      service.create({
        name: '',
        email: '6dL0t@example.com',
        password: '5599',
        role: UserRole.Student,
        isActive: true,
      }),
    ).rejects.toThrow('User validation failed: name: Path `name` is required.');
  });

  it('should return error when finding one user by invalid id', async () => {
    await expect(service.findOne('1')).rejects.toThrow(
      'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "User"',
    );
  });

  it('should find all users', async () => {
    await service.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const users = await service.findAll();
    expect(users).toHaveLength(1);
  });

  it('should update a valid user', async () => {
    const user = await service.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const updated = await service.update(user.id, {
      name: 'Updated Name',
    });
    expect(updated).toHaveProperty('id');
    expect(updated?.name).toBe('Updated Name');
  });

  it('should delete a valid user', async () => {
    const user = await service.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const deleted = await service.remove(user.id);
    expect(deleted).toBeUndefined();
  });

  it('should find user by email', async () => {
    await service.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const user = await service.findByEmail('6dL0t@example.com');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('6dL0t@example.com');
  });
});
