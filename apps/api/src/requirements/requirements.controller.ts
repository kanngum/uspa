import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RequirementsService } from './requirements.service';

@Controller()
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get('programmes/:programmeId/requirements')
  async getProgrammeRequirements(@Param('programmeId') programmeId: string) {
    const result =
      await this.requirementsService.getProgrammeRequirements(programmeId);
    return { success: true, data: result };
  }

  @Post('programmes/:programmeId/requirements')
  async addRequirement(
    @Param('programmeId') programmeId: string,
    @Body()
    input: {
      subjectId: string;
      requirementType?: string;
      minimumGrade?: string;
    },
  ) {
    const requirement = await this.requirementsService.addRequirement(
      programmeId,
      input,
    );
    return { success: true, data: requirement };
  }

  @Post('programmes/:programmeId/requirements/bulk')
  async bulkAddRequirements(
    @Param('programmeId') programmeId: string,
    @Body()
    inputs: Array<{
      subjectId: string;
      requirementType?: string;
      minimumGrade?: string;
    }>,
  ) {
    const result = await this.requirementsService.bulkAddRequirements(
      programmeId,
      inputs,
    );
    return { success: true, data: result };
  }

  @Patch('requirements/:id')
  async updateRequirement(
    @Param('id') id: string,
    @Body()
    input: {
      requirementType?: string;
      minimumGrade?: string;
    },
  ) {
    const requirement = await this.requirementsService.updateRequirement(
      id,
      input,
    );
    return { success: true, data: requirement };
  }

  @Delete('requirements/:id')
  async removeRequirement(@Param('id') id: string) {
    const result = await this.requirementsService.removeRequirement(id);
    return { success: true, data: result };
  }
}
