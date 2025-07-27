import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from './decorators/is-public';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Verifica o status da API (Health Check)' }) 
  @ApiResponse({ 
    status: 200,
    description: 'Retorna uma mensagem de boas-vindas confirmando que a API está no ar.',
    type: String, 
  })
  getHello(): string {
    return "Bem-vindo(a) à API Blog Education! A aplicação está online.";
  }

  @Get('/docker')
  @IsPublic()
  @ApiOperation({
    summary: 'Verifica o status da API (Health Check) no Docker',
    description: 'Endpoint usado por serviço de nuvem para verificar se o contêiner da aplicação está online.',
  })
  @ApiResponse({
    status: 200,
    description: 'A API está respondendo corretamente.',
    type: String, 
  })
  getDockerHealthCheck(): string {
    return 'OK';
  }

}
