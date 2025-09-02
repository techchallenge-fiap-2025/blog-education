import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: LoginDto): Promise<{
    token: string;
    user: { name: string; email: string; role: string };
  }> {
    const user = await this.usersService.findByEmail(login.email);

    // TODO: Refatorar esta lógica para usar `bcrypt.compare()` e garantir que as
    // senhas sejam armazenadas como HASH no banco de dados, e não como texto puro.
    if (user?.password !== login.password) {
      throw new UnauthorizedException(
        'Credenciais inválidas (e-mail ou senha incorretos).',
      );
    }
    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    const returnedUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      token: await this.jwtService.signAsync(payload),
      user: returnedUser,
    };
  }
}
