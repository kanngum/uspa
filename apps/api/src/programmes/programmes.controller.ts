import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';

@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Get()
  async search(
    @Query('query') query?: string,
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('degreeType') degreeType?: string,
    @Query('level') level?: string,
    @Query('career') career?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.programmesService.search({
      query,
      facultyId,
      departmentId,
      degreeType,
      level,
      career,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    return { success: true, ...result };
  }

  @Get('featured')
  async getFeatured() {
    const programmes = await this.programmesService.getFeatured();
    return { success: true, data: programmes };
  }

  @Get('autocomplete')
  async autocomplete(@Query('q') q: string) {
    const suggestions = await this.programmesService.getAutoComplete(q);
    return { success: true, data: suggestions };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const programme = await this.programmesService.findOne(id);
    return { success: true, data: programme };
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    const programme = await this.programmesService.findByCode(code);
    return { success: true, data: programme };
  }
}

