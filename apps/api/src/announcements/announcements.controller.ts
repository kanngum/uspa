import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @Get()
  async findPublished() {
    const announcements =
      await this.announcementsService.findPublished();

    return {
      success: true,
      data: announcements,
    };
  }

  @Get(':slug')
  async findPublishedBySlug(@Param('slug') slug: string) {
    const announcement =
      await this.announcementsService.findPublishedBySlug(slug);

    if (!announcement) {
      throw new NotFoundException('News article not found');
    }

    return {
      success: true,
      data: announcement,
    };
  }
}