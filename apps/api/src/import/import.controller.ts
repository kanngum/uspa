import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ImportService } from './import.service';

@Controller('import')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('validate')
  async validateData(
    @Body() input: { type: string; data: any[] },
  ) {
    const result = await this.importService.validate(input.type, input.data);
    return { success: true, data: result };
  }

  @Post('preview')
  async previewData(
    @Body() input: { type: string; data: any[] },
  ) {
    const result = await this.importService.preview(input.type, input.data);
    return { success: true, data: result };
  }

  @Post('confirm')
  async confirmImport(
    @Body() input: { type: string; data: any[] },
  ) {
    const result = await this.importService.confirm(input.type, input.data);
    return { success: true, data: result };
  }

  @Post('upload')
  async uploadData(@Body() input: { data: any }) {
    const result = await this.importService.upload(input.data);
    return { success: true, data: result };
  }

  @Post('quick')
  async quickImport(@Body() input: { type: string; data: any[] }) {
    const result = await this.importService.quick(input.type, input.data);
    return { success: true, data: result };
  }
}

