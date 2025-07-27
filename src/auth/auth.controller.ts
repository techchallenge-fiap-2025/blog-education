import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from '../decorators/is-public';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza a autenticação de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Retorna um token de acesso (access_token).',
  })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos (ex: e-mail em formato incorreto).' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas (e-mail ou senha incorretos).' })
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }
}
