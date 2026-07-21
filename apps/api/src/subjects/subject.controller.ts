import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { SubjectsService } from './subject.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('level') level?: string,
  ) {
    const result = await this.subjectsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      search,
      level,
    });
    return { success: true, ...result };
  }

  @Get('by-level/:level')
  async getByLevel(@Param('level') level: string) {
    const subjects = await this.subjectsService.getByLevel(level);
    return { success: true, data: subjects };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const subject = await this.subjectsService.findOne(id);
    return { success: true, data: subject };
  }

  @Post()
  async create(@Body() input: { name: string; code?: string; level: string }) {
    const subject = await this.subjectsService.create(input);
    return { success: true, data: subject };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() input: { name?: string; code?: string; level?: string },
  ) {
    const subject = await this.subjectsService.update(id, input);
    return { success: true, data: subject };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.subjectsService.remove(id);
    return { success: true, data: result };
  }
}
