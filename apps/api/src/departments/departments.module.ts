import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { FacultiesModule } from '../faculties/faculties.module';

@Module({
  imports: [FacultiesModule],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}

