import { Module } from '@nestjs/common';
import { AcademicUnitsService } from './academic-units.service';
import { AcademicUnitsController } from './academic-units.controller';

@Module({
  controllers: [AcademicUnitsController],
  providers: [AcademicUnitsService],
})
export class AcademicUnitsModule {}
