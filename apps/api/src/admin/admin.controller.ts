import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('dashboard/programmes-by-faculty')
  async getProgrammesByFaculty() {
    const data = await this.adminService.getProgrammesByFaculty();
    return { success: true, data };
  }

  @Get('dashboard/popular-searches')
  async getPopularSearches(@Query('limit') limit?: string) {
    const data = await this.adminService.getPopularSearches(
      limit ? parseInt(limit, 10) : 10,
    );
    return { success: true, data };
  }

  @Get('dashboard/recent-searches')
  async getRecentSearches(@Query('limit') limit?: string) {
    const data = await this.adminService.getRecentSearches(
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, data };
  }

  @Get('dashboard/user-stats')
  async getUserStats() {
    const data = await this.adminService.getUserStats();
    return { success: true, data };
  }

  // ==================== PROGRAMME MANAGEMENT ====================

  @Get('programmes')
  async getAllProgrammes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.adminService.getAllProgrammes(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...data };
  }

  @Put('programmes/:id')
  async updateProgramme(
    @Param('id') id: string,
    @Body() input: any,
  ) {
    const programme = await this.adminService.updateProgramme(id, input);
    return { success: true, data: programme };
  }

  @Delete('programmes/:id')
  async deleteProgramme(@Param('id') id: string) {
    const result = await this.adminService.deleteProgramme(id);
    return { success: true, data: result };
  }

  // ==================== USER MANAGEMENT ====================

  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...data };
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() input: { role: string },
  ) {
    const user = await this.adminService.updateUserRole(id, input.role);
    return { success: true, data: user };
  }

  @Patch('users/:id/toggle-active')
  async toggleUserActive(@Param('id') id: string) {
    const user = await this.adminService.toggleUserActive(id);
    return { success: true, data: user };
  }

  // ==================== FACULTY/DEPARTMENT MANAGEMENT ====================

  @Post('faculties')
  async createFaculty(@Body() input: any) {
    const faculty = await this.adminService.createFaculty(input);
    return { success: true, data: faculty };
  }

  @Put('faculties/:id')
  async updateFaculty(@Param('id') id: string, @Body() input: any) {
    const faculty = await this.adminService.updateFaculty(id, input);
    return { success: true, data: faculty };
  }

  @Post('departments')
  async createDepartment(@Body() input: any) {
    const department = await this.adminService.createDepartment(input);
    return { success: true, data: department };
  }

  @Put('departments/:id')
  async updateDepartment(@Param('id') id: string, @Body() input: any) {
    const department = await this.adminService.updateDepartment(id, input);
    return { success: true, data: department };
  }

  // ==================== ANNOUNCEMENTS ====================

  @Post('announcements')
  async createAnnouncement(
    @Body() input: { title: string; content: string },
    @Request() req: any,
  ) {
    const announcement = await this.adminService.createAnnouncement({
      ...input,
      authorId: req.user.sub,
    });
    return { success: true, data: announcement };
  }

  @Get('announcements')
  async getAnnouncements(@Query('published') published?: string) {
    const announcements = await this.adminService.getAnnouncements(
      published !== undefined ? published === 'true' : undefined,
    );
    return { success: true, data: announcements };
  }

  @Patch('announcements/:id/toggle')
  async toggleAnnouncement(@Param('id') id: string) {
    const announcement = await this.adminService.toggleAnnouncement(id);
    return { success: true, data: announcement };
  }

  @Delete('announcements/:id')
  async deleteAnnouncement(@Param('id') id: string) {
    const result = await this.adminService.deleteAnnouncement(id);
    return { success: true, data: result };
  }
}

