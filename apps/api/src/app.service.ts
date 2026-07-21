import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    const count = await this.prisma.university.count();

    return {
      status: 'USPA API Running',
      universities: count,
    };
  }
}
