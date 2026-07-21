import { Controller, Get, Param } from '@nestjs/common';
import { FacultiesService } from '../faculties/faculties.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get(':id/programmes')
  async getProgrammes(@Param('id') id: string) {
    const department = await this.facultiesService.getDepartmentProgrammes(id);
    return { success: true, data: department };
  }
}

