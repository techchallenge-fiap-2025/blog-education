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
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //   POST /posts - Criação de Postagens:
  // ▪ Permite que docentes criem novas postagens. Este
  // endpoint aceitará dados como título, conteúdo e autor no
  // corpo da requisição.
  @Post()
  @Roles(UserRole.Teacher)
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
  //   GET /posts - Listagem de Todas as Postagens:
  // ▪ Este endpoint permitirá que professores vejam todas as
  // postagens criadas, facilitando a gestão do conteúdo.

  @Get('all')
  @Roles(UserRole.Teacher)
  async findAll(limit: number, page: number) {
    return this.postsService.findAll(limit, page);
  }

  //   GET /posts - Lista de Posts:
  // ▪ Este endpoint permitirá aos alunos visualizarem uma lista de
  //  posts disponíveis na página principal.
  @Get('published')
  async findAllPublished() {
    return this.postsService.findAllPublished();
  }

  //   GET /posts/:id - Leitura de Posts:
  // ▪ Ao acessar este endpoint com um ID específico de post, os
  // alunos poderão ler o conteúdo completo desse post.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  //   PATCH /posts/:id - Edição de Postagens:
  // ▪ Usado para editar uma postagem existente. Professores
  // deverão fornecer o ID do post que desejam editar e os novos
  // dados no corpo da requisição.
  @Patch(':id')
  @Roles(UserRole.Teacher)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  //   DELETE /posts/:id - Exclusão de Postagens:
  // ▪ Permite que docentes excluam uma postagem específica,
  // usando o ID do post como parâmetro
  @Delete(':id')
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
  async search(@Query() dto: SearchPostDto) {
    return this.postsService.search(dto.term);
  }
}
