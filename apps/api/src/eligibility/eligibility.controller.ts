import { Body, Controller, Post } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import type { EligibilityCheckInput } from './eligibility.service';

@Controller('eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post('check')
  async checkEligibility(@Body() input: EligibilityCheckInput) {
    const results = await this.eligibilityService.checkEligibility(input);
    return { success: true, data: results };
  }
}
