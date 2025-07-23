import { Injectable, UnauthorizedException} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: LoginDto): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(login.email);

    // TODO: Refatorar esta lógica para usar `bcrypt.compare()` e garantir que as
    // senhas sejam armazenadas como HASH no banco de dados, e não como texto puro.
    if (user?.password !== login.password) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    return { token: await this.jwtService.signAsync(payload) };
  }

  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
