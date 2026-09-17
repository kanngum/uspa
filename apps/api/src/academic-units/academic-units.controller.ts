import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { AcademicUnitsService } from './academic-units.service';
import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';

@Controller('academic-units')
export class AcademicUnitsController {
  constructor(
    private readonly academicUnitsService: AcademicUnitsService,
  ) {}

  @Post()
  async create(@Body() createAcademicUnitDto: CreateAcademicUnitDto) {
    const data = await this.academicUnitsService.create(createAcademicUnitDto);
    return { success: true, data };
  }

  @Get()
  async findAll() {
    const data = await this.academicUnitsService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.academicUnitsService.findOne(id);
    if (!data) {
      throw new NotFoundException(`Academic unit with ID ${id} not found`);
    }
    return { success: true, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAcademicUnitDto: UpdateAcademicUnitDto,
  ) {
    const existing = await this.academicUnitsService.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Academic unit with ID ${id} not found`);
    }
    const data = await this.academicUnitsService.update(id, updateAcademicUnitDto);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.academicUnitsService.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Academic unit with ID ${id} not found`);
    }
    const data = await this.academicUnitsService.remove(id);
    return { success: true, data };
  }
}
