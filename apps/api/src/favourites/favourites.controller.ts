import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavouritesService } from './favourites.service';

@Controller('favourites')
@UseGuards(AuthGuard('jwt'))
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  async getFavourites(@Request() req: any) {
    const favourites = await this.favouritesService.getFavourites(req.user.sub);
    return { success: true, data: favourites };
  }

  @Post(':programmeId')
  async addFavourite(
    @Request() req: any,
    @Param('programmeId') programmeId: string,
  ) {
    const result = await this.favouritesService.addFavourite(
      req.user.sub,
      programmeId,
    );
    return { success: true, data: result };
  }

  @Delete(':programmeId')
  async removeFavourite(
    @Request() req: any,
    @Param('programmeId') programmeId: string,
  ) {
    const result = await this.favouritesService.removeFavourite(
      req.user.sub,
      programmeId,
    );
    return { success: true, data: result };
  }

  @Get('check/:programmeId')
  async checkFavourite(
    @Request() req: any,
    @Param('programmeId') programmeId: string,
  ) {
    const isFavourite = await this.favouritesService.checkFavourite(
      req.user.sub,
      programmeId,
    );
    return { success: true, data: { isFavourite } };
  }
}
