import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ProgrammesModule } from '../programmes/programmes.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [ProgrammesModule, EligibilityModule, RecommendationsModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
