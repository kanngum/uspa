import { Controller, Get, Param } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  async findAll() {
    const universities = await this.universitiesService.findAll();
    return { success: true, data: universities };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const university = await this.universitiesService.findOne(id);
    return { success: true, data: university };
  }
}

