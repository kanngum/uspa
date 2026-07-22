import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FacultiesModule } from './faculties/faculties.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { SubjectsModule } from './subjects/subject.module';
import { RequirementsModule } from './requirements/requirements.module';
import { EligibilityModule } from './eligibility/eligibility.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { FavouritesModule } from './favourites/favourites.module';
import { CompareModule } from './compare/compare.module';
import { AdminModule } from './admin/admin.module';
import { AcademicUnitsModule } from './academic-units/academic-units.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    PrismaModule,
    FacultiesModule,
    DepartmentsModule,
    ProgrammesModule,
    SubjectsModule,
    RequirementsModule,
    EligibilityModule,
    RecommendationsModule,
    AiModule,
    AuthModule,
    FavouritesModule,
    CompareModule,
    AdminModule,
    AcademicUnitsModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
