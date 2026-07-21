import { Body, Controller, Post } from '@nestjs/common';
import { CompareService } from './compare.service';

@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

  @Post()
  async compare(@Body() input: { programmeIds: string[] }) {
    const programmes = await this.compareService.compare(input.programmeIds);
    return { success: true, data: programmes };
  }

  @Post('table')
  async comparisonTable(@Body() input: { programmeIds: string[] }) {
    const table = await this.compareService.getComparisonTable(
      input.programmeIds,
    );
    return { success: true, data: table };
  }
}
