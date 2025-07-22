import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../decorators/roles';
import { UserRole } from './schemas/models/user.interface';
import { IsPublic } from '../decorators/is-public';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Users') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'O usuário foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já existente.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.Teacher)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os usuários (apenas para professores)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Recurso apenas para professores.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Teacher)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca um usuário específico pelo ID (apenas para professores)' })
  @ApiParam({ name: 'id', description: 'O ID do usuário a ser atualizado.' })
  @ApiResponse({ status: 200, description: 'Dados do usuário retornados com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Teacher)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um usuário (apenas para professores)' })
  @ApiParam({ name: 'id', description: 'O ID do usuário a ser atualizado.' }) 
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.Teacher)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um usuário (apenas para Professores)' })
  @ApiParam({ name: 'id', description: 'O ID do usuário a ser atualizado.' }) 
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
