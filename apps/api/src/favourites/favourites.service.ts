import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavourite(userId: string, programmeId: string) {
    // Check programme exists
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
    });
    if (!programme) {
      throw new NotFoundException('Programme not found');
    }

    // Check if already saved
    const existing = await this.prisma.savedProgramme.findUnique({
      where: { userId_programmeId: { userId, programmeId } },
    });

    if (existing) {
      return { message: 'Programme already in favourites' };
    }

    const saved = await this.prisma.savedProgramme.create({
      data: { userId, programmeId },
      include: {
        programme: {
          select: { id: true, name: true, code: true, degree: true },
        },
      },
    });

    return saved;
  }

  async removeFavourite(userId: string, programmeId: string) {
    const existing = await this.prisma.savedProgramme.findUnique({
      where: { userId_programmeId: { userId, programmeId } },
    });

    if (!existing) {
      throw new NotFoundException('Favourite not found');
    }

    await this.prisma.savedProgramme.delete({
      where: { id: existing.id },
    });

    return { message: 'Programme removed from favourites' };
  }

  async getFavourites(userId: string) {
    return this.prisma.savedProgramme.findMany({
      where: { userId },
      include: {
        programme: {
          include: {
            department: {
              include: {
                academicUnit: {
                  select: { id: true, name: true, abbreviation: true },
                },
              },
            },
            tuition: {
              take: 1,
              orderBy: { academicYear: 'desc' },
              select: { amount: true, currency: true },
            },
            _count: {
              select: { requirements: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkFavourite(userId: string, programmeId: string): Promise<boolean> {
    const existing = await this.prisma.savedProgramme.findUnique({
      where: { userId_programmeId: { userId, programmeId } },
    });
    return !!existing;
  }
}

