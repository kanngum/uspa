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
import { ProgrammesService } from './programmes.service';

@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Get()
  async search(
    @Query('query') query?: string,
    @Query('universityId') universityId?: string,
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('degreeType') degreeType?: string,
    @Query('level') level?: string,
    @Query('career') career?: string,
    @Query('minFee') minFee?: string,
    @Query('maxFee') maxFee?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.programmesService.search({
      query,
      universityId,
      facultyId,
      departmentId,
      degreeType,
      level,
      career,
      minFee: minFee ? parseInt(minFee, 10) : undefined,
      maxFee: maxFee ? parseInt(maxFee, 10) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    return { success: true, ...result };
  }

  @Get('featured')
  async getFeatured(@Query('universityId') universityId?: string) {
    const programmes = await this.programmesService.getFeatured(universityId);
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

  @Post()
  async create(
    @Body()
    input: {
      departmentId: string;
      code: string;
      name: string;
      degree: string;
      level: string;
      duration: number;
      description?: string;
    },
  ) {
    const programme = await this.programmesService.create(input);
    return { success: true, data: programme };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    input: {
      departmentId?: string;
      code?: string;
      name?: string;
      degree?: string;
      level?: string;
      duration?: number;
      description?: string;
    },
  ) {
    const programme = await this.programmesService.update(id, input);
    return { success: true, data: programme };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.programmesService.remove(id);
    return { success: true, data: result };
  }
}
