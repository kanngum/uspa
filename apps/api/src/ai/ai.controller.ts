import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import type { AiQueryInput } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async ask(@Body() input: AiQueryInput) {
    const response = await this.aiService.processQuery(input);
    return { success: true, data: response };
  }
}

