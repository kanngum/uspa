import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicUnitsService } from './academic-units.service';
import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';

@Controller('academic-units')
export class AcademicUnitsController {
  constructor(
    private readonly academicUnitsService: AcademicUnitsService,
  ) {}

  @Post()
  create(@Body() createAcademicUnitDto: CreateAcademicUnitDto) {
    return this.academicUnitsService.create(createAcademicUnitDto);
  }

  @Get()
  findAll() {
    return this.academicUnitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicUnitsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAcademicUnitDto: UpdateAcademicUnitDto,
  ) {
    return this.academicUnitsService.update(id, updateAcademicUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicUnitsService.remove(id);
  }
}