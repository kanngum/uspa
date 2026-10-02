import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { OptionalJwtGuard } from './optional-jwt.guard';

@Controller('search-history')
export class SearchHistoryController {
  constructor(
    private readonly searchHistoryService: SearchHistoryService,
  ) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  async record(
    @Request() req: any,
    @Body()
    input: {
      query?: string;
      filters?: Record<string, unknown>;
    },
  ) {
    const userId =
      typeof req.user?.sub === 'string'
        ? req.user.sub
        : null;

    const history = await this.searchHistoryService.record(
      userId,
      input,
    );

    return {
      success: true,
      data: history,
    };
  }

  @Get()
  @UseGuards(OptionalJwtGuard)
  async getHistory(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    if (!req.user?.sub) {
      return {
        success: true,
        data: [],
      };
    }

    const history =
      await this.searchHistoryService.getUserHistory(
        req.user.sub,
        limit ? parseInt(limit, 10) : 20,
      );

    return {
      success: true,
      data: history,
    };
  }

  @Delete()
  @UseGuards(OptionalJwtGuard)
  async clearHistory(@Request() req: any) {
    if (!req.user?.sub) {
      return {
        success: true,
        data: {
          deletedCount: 0,
        },
      };
    }

    const result =
      await this.searchHistoryService.clearUserHistory(
        req.user.sub,
      );

    return {
      success: true,
      data: result,
    };
  }
}