import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('similar/:programmeId')
  async getSimilar(
    @Param('programmeId') programmeId: string,
    @Query('limit') limit?: string,
  ) {
    const programmes = await this.recommendationsService.getSimilarProgrammes(
      programmeId,
      limit ? parseInt(limit, 10) : 5,
    );
    return { success: true, data: programmes };
  }

  @Get('career')
  async byCareer(
    @Query('q') careerName: string,
    @Query('limit') limit?: string,
  ) {
    const programmes =
      await this.recommendationsService.getCareerRecommendations(
        careerName,
        limit ? parseInt(limit, 10) : 10,
      );
    return { success: true, data: programmes };
  }

  @Get('subjects')
  async bySubjects(
    @Query('subjectIds') subjectIds: string,
    @Query('limit') limit?: string,
  ) {
    const ids = subjectIds.split(',');
    const programmes =
      await this.recommendationsService.getSubjectRecommendations(
        ids,
        limit ? parseInt(limit, 10) : 10,
      );
    return { success: true, data: programmes };
  }

  @Get('alternatives')
  async alternatives(
    @Query('missingSubjectIds') missingSubjectIds: string,
    @Query('limit') limit?: string,
  ) {
    const ids = missingSubjectIds.split(',');
    const programmes =
      await this.recommendationsService.getAlternativeProgrammes(
        ids,
        limit ? parseInt(limit, 10) : 5,
      );
    return { success: true, data: programmes };
  }
}
