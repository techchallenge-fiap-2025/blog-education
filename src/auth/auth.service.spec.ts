import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user/schemas/user.schema';
import { UserRepository } from '../user/repository/user.repository';
import { UserMongooseRepository } from '../user/repository/mongoose/user.mongoose.repository';
import { UserRole } from '../user/schemas/models/user.interface';
import { LoginDto } from './dto/login.dto';

describe('AuthService integration tests', () => {
  let service: AuthService;
  let serviceUser: UserService;
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
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        UserMongooseRepository,
        {
          provide: UserRepository,
          useExisting: UserMongooseRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    serviceUser = module.get<UserService>(UserService);
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

  it('should create a user and SignIn', async () => {
    await serviceUser.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const loginInput: LoginDto = {
      email: '6dL0t@example.com',
      password: '5599',
    };
    const token = await service.signIn(loginInput);
    expect(token.token).toBeDefined();
  });

  it('shoul return unauthorized exception when credials are invalid', async () => {
    await serviceUser.create({
      name: 'John Doe',
      email: '6dL0t@example.com',
      password: '5599',
      role: UserRole.Student,
      isActive: true,
    });
    const loginInput: LoginDto = {
      email: '6dL0t@example.com',
      password: '559',
    };
    await expect(service.signIn(loginInput)).rejects.toThrow('Credenciais inválidas (e-mail ou senha incorretos).');
  });
});
