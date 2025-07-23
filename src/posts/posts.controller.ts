import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post';
import { Roles } from '../decorators/roles';
import { UserRole } from '../user/schemas/models/user.interface';
import { RolesGuard } from '../auth/roles.guard';
import { 
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags, 
} from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //   POST /posts - Criação de Postagens:
  // ▪ Permite que docentes criem novas postagens. Este
  // endpoint aceitará dados como título, conteúdo e autor no
  // corpo da requisição.
  @Post()
  @ApiOperation({ summary: 'Cria um novo post (apenas para professores).' })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Os dados enviados na requisição são inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autenticado. É necessário um token de acesso válido.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (requer login).' })
  @Roles(UserRole.Teacher)
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
  //   GET /posts - Listagem de Todas as Postagens:
  // ▪ Este endpoint permitirá que professores vejam todas as
  // postagens criadas, facilitando a gestão do conteúdo.

  @Get('all')
  @Roles(UserRole.Teacher)
  @ApiOperation({ summary: 'Lista todos os posts (publicados ou não).' })
  @ApiResponse({ status: 200, description: 'Lista de posts retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado. É necessário um token de acesso válido.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (ex: você não é um professor).' })
  async findAll(limit: number, page: number) {
    return this.postsService.findAll(limit, page);
  }

  //   GET /posts - Lista de Posts:
  // ▪ Este endpoint permitirá aos alunos visualizarem uma lista de
  //  posts disponíveis na página principal.
  @Get('published')
  @ApiOperation({ summary: 'Lista todos os posts publicados.' })
  @ApiResponse({ status: 200, description: 'Lista de posts retornada com sucesso.' })
  async findAllPublished() {
    return this.postsService.findAllPublished();
  }

  //   GET /posts/:id - Leitura de Posts:
  // ▪ Ao acessar este endpoint com um ID específico de post, os
  // alunos poderão ler o conteúdo completo desse post.
  @Get(':id')
  @ApiOperation({ summary: 'Busca um post específico pelo ID' })
  @ApiParam({ name: 'id', description: 'O ID do post a ser buscado.' })
  @ApiResponse({ status: 200, description: 'Dados do post retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  //   PATCH /posts/:id - Edição de Postagens:
  // ▪ Usado para editar uma postagem existente. Professores
  // deverão fornecer o ID do post que desejam editar e os novos
  // dados no corpo da requisição.
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um post específico (somente professores)' })
  @ApiParam({ name: 'id', description: 'O ID do post a ser atualizado.' })
  @ApiResponse({ status: 200, description: 'Post atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Os dados enviados na requisição são inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (ex: você não é um professor).' })
  @ApiResponse({ status: 404, description: 'Post não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autenticado. É necessário um token de acesso válido.' })
  @Roles(UserRole.Teacher)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  //   DELETE /posts/:id - Exclusão de Postagens:
  // ▪ Permite que docentes excluam uma postagem específica,
  // usando o ID do post como parâmetro
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um post específico' })
  @ApiParam({ name: 'id', description: 'O ID do post a ser removido.' })
  @ApiResponse({ status: 200, description: 'Post removido com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Post não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autenticado. É necessário um token de acesso válido.' })
  @Roles(UserRole.Teacher)
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  //   GET /posts/search - Busca de Posts:
  // ▪
  // Este endpoint permitirá a busca de posts por palavras-
  // chave. Os usuários poderão passar uma query string com o
  // termo de busca e o sistema retornará uma lista de posts que
  // contêm esse termo no título ou conteúdo.
  @Get('search')
  @ApiOperation({ summary: 'Busca posts por um termo no título ou conteúdo' })
  @ApiResponse({ status: 200, description: 'Retorna uma lista de posts que correspondem ao termo de busca.' })
  @ApiResponse({ status: 404, description: 'Post não encontrado.' })
  async search(@Query() dto: SearchPostDto) {
    return this.postsService.search(dto.term);
  }
}
