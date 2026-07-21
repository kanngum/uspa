import { Controller, Get, Param } from '@nestjs/common';
import { FacultiesService } from './faculties.service';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  async findAll() {
    const faculties = await this.facultiesService.findAll();
    return { success: true, data: faculties };
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
}

