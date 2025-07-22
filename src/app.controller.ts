import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from './decorators/is-public';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Verifica o status da API (Health Check)' }) 
  @ApiResponse({ 
    status: 200,
    description: 'Retorna uma mensagem de boas-vindas confirmando que a API está no ar.',
    type: String, 
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/docker')
  @IsPublic()
  getHelloDocker(): string {
    return 'Olá docker!';
  }

}
