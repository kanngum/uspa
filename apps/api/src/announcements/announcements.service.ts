import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished() {
    return this.prisma.announcement.findMany({
      where: {
        published: true,
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 6,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async findPublishedBySlug(slug: string) {
    return this.prisma.announcement.findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }
}