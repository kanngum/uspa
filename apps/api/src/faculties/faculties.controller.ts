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
import { FacultiesService } from './faculties.service';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    const result = await this.facultiesService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      type,
    });
    return { success: true, ...result };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.facultiesService.getFacultyStats();
    return { success: true, data: stats };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const faculty = await this.facultiesService.findOne(id);
    return { success: true, data: faculty };
  }

  @Get(':id/departments')
  async getDepartments(@Param('id') id: string) {
    const departments = await this.facultiesService.getDepartments(id);
    return { success: true, data: departments };
  }

  @Post()
  async create(
    @Body()
    input: {
      name: string;
      abbreviation?: string;
      description?: string;
      type?: string;
      universityId?: string;
    },
  ) {
    const faculty = await this.facultiesService.create(input);
    return { success: true, data: faculty };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    input: {
      name?: string;
      abbreviation?: string;
      description?: string;
      type?: string;
    },
  ) {
    const faculty = await this.facultiesService.update(id, input);
    return { success: true, data: faculty };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.facultiesService.remove(id);
    return { success: true, data: result };
  }
}
