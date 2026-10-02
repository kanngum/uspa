import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordSearchHistoryInput {
  query?: string;
  filters?: Record<string, unknown>;
}

@Injectable()
export class SearchHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    userId: string | null,
    input: RecordSearchHistoryInput,
  ) {
    const query = input.query?.trim() || '';
    const filters = input.filters || {};

    const hasMeaningfulFilter = Object.values(filters).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== false,
    );

    if (!query && !hasMeaningfulFilter) {
      return null;
    }

    const jsonFilters: Prisma.InputJsonValue =
      JSON.parse(JSON.stringify(filters));

    return this.prisma.searchHistory.create({
      data: {
        userId,
        query,
        filters: jsonFilters,
      },
    });
  }

  async getUserHistory(userId: string, limit = 20) {
    const safeLimit = Math.min(100, Math.max(1, limit));

    return this.prisma.searchHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
    });
  }

  async clearUserHistory(userId: string) {
    const result = await this.prisma.searchHistory.deleteMany({
      where: {
        userId,
      },
    });

    return {
      deletedCount: result.count,
    };
  }
}