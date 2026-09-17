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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
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
    @Query('search') search?: string,
    @Query('facultyId') facultyId?: string,
  ) {
    const data = await this.adminService.getAllProgrammes(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
      facultyId,
    );
    return { success: true, ...data };
  }

  @Put('programmes/:id')
  async updateProgramme(@Param('id') id: string, @Body() input: any) {
    const programme = await this.adminService.updateProgramme(id, input);
    return { success: true, data: programme };
  }

  @Delete('programmes/:id')
  async deleteProgramme(@Param('id') id: string) {
    const result = await this.adminService.deleteProgramme(id);
    return { success: true, data: result };
  }

  @Get('catalogue/review')
  async getCatalogueReview(@Query('page') page?: string, @Query('limit') limit?: string) {
    const data = await this.adminService.getCatalogueReview(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
    return { success: true, ...data };
  }

  @Patch('catalogue/review/:id')
  async resolveCatalogueReview(@Param('id') id: string, @Body() input: any) {
    const data = await this.adminService.resolveCatalogueReview(id, input);
    return { success: true, data };
  }

  @Post('programmes')
  async createProgramme(@Body() input: any) {
    const programme = await this.adminService.createProgramme(input);
    return { success: true, data: programme };
  }

  // ==================== PROGRAMME CAREER/KEYWORD ASSOCIATIONS ====================

  @Post('programmes/:id/careers')
  async addProgrammeCareer(
    @Param('id') id: string,
    @Body() input: { careerId: string },
  ) {
    const result = await this.adminService.addProgrammeCareer(id, input.careerId);
    return { success: true, data: result };
  }

  @Delete('programmes/:id/careers/:careerId')
  async removeProgrammeCareer(
    @Param('id') id: string,
    @Param('careerId') careerId: string,
  ) {
    const result = await this.adminService.removeProgrammeCareer(id, careerId);
    return { success: true, data: result };
  }

  @Post('programmes/:id/keywords')
  async addProgrammeKeyword(
    @Param('id') id: string,
    @Body() input: { keywordId: string },
  ) {
    const result = await this.adminService.addProgrammeKeyword(id, input.keywordId);
    return { success: true, data: result };
  }

  @Delete('programmes/:id/keywords/:keywordId')
  async removeProgrammeKeyword(
    @Param('id') id: string,
    @Param('keywordId') keywordId: string,
  ) {
    const result = await this.adminService.removeProgrammeKeyword(id, keywordId);
    return { success: true, data: result };
  }

  // ==================== USER MANAGEMENT ====================

  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
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

  // ==================== SUBJECT MANAGEMENT ====================

  @Get('subjects')
  async getAllSubjects(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('level') level?: string,
  ) {
    const data = await this.adminService.getAllSubjects(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      search,
      level,
    );
    return { success: true, ...data };
  }

  @Post('subjects')
  async createSubject(
    @Body() input: { name: string; code?: string; level: string },
  ) {
    const subject = await this.adminService.createSubject(input);
    return { success: true, data: subject };
  }

  @Put('subjects/:id')
  async updateSubject(
    @Param('id') id: string,
    @Body() input: { name?: string; code?: string; level?: string },
  ) {
    const subject = await this.adminService.updateSubject(id, input);
    return { success: true, data: subject };
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    const result = await this.adminService.deleteSubject(id);
    return { success: true, data: result };
  }

  // ==================== UNIVERSITY MANAGEMENT ====================

  @Post('universities')
  async createUniversity(@Body() input: { name: string; abbreviation: string; description?: string; website?: string }) {
    const university = await this.adminService.createUniversity(input);
    return { success: true, data: university };
  }

  @Put('universities/:id')
  async updateUniversity(@Param('id') id: string, @Body() input: { name?: string; abbreviation?: string; description?: string; website?: string }) {
    const university = await this.adminService.updateUniversity(id, input);
    return { success: true, data: university };
  }

  @Delete('universities/:id')
  async deleteUniversity(@Param('id') id: string) {
    const result = await this.adminService.deleteUniversity(id);
    return { success: true, data: result };
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

  @Delete('faculties/:id')
  async deleteFaculty(@Param('id') id: string) {
    const result = await this.adminService.deleteFaculty(id);
    return { success: true, data: result };
  }

  @Get('departments')
  async getAllDepartments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getAllDepartments(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 200,
      search,
    );
    return { success: true, ...data };
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

  @Delete('departments/:id')
  async deleteDepartment(@Param('id') id: string) {
    const result = await this.adminService.deleteDepartment(id);
    return { success: true, data: result };
  }

  // ==================== TUITION MANAGEMENT ====================

  @Get('tuition')
  async getAllTuition(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('programmeId') programmeId?: string,
  ) {
    const data = await this.adminService.getAllTuition(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      programmeId,
    );
    return { success: true, ...data };
  }

  @Post('tuition')
  async createTuition(
    @Body() input: {
      programmeId: string;
      academicYear: string;
      amount: number;
      currency?: string;
    },
  ) {
    const tuition = await this.adminService.createTuition(input);
    return { success: true, data: tuition };
  }

  @Put('tuition/:id')
  async updateTuition(
    @Param('id') id: string,
    @Body() input: { academicYear?: string; amount?: number; currency?: string },
  ) {
    const tuition = await this.adminService.updateTuition(id, input);
    return { success: true, data: tuition };
  }

  @Delete('tuition/:id')
  async deleteTuition(@Param('id') id: string) {
    const result = await this.adminService.deleteTuition(id);
    return { success: true, data: result };
  }

  // ==================== CAREER MANAGEMENT ====================

  @Get('careers')
  async getAllCareers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getAllCareers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      search,
    );
    return { success: true, ...data };
  }

  @Post('careers')
  async createCareer(
    @Body() input: { name: string; description?: string },
  ) {
    const career = await this.adminService.createCareer(input);
    return { success: true, data: career };
  }

  @Put('careers/:id')
  async updateCareer(
    @Param('id') id: string,
    @Body() input: { name?: string; description?: string },
  ) {
    const career = await this.adminService.updateCareer(id, input);
    return { success: true, data: career };
  }

  @Delete('careers/:id')
  async deleteCareer(@Param('id') id: string) {
    const result = await this.adminService.deleteCareer(id);
    return { success: true, data: result };
  }

  // ==================== KEYWORD MANAGEMENT ====================

  @Get('keywords')
  async getAllKeywords(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getAllKeywords(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      search,
    );
    return { success: true, ...data };
  }

  @Post('keywords')
  async createKeyword(@Body() input: { word: string }) {
    const keyword = await this.adminService.createKeyword(input);
    return { success: true, data: keyword };
  }

  @Put('keywords/:id')
  async updateKeyword(
    @Param('id') id: string,
    @Body() input: { word?: string },
  ) {
    const keyword = await this.adminService.updateKeyword(id, input);
    return { success: true, data: keyword };
  }

  @Delete('keywords/:id')
  async deleteKeyword(@Param('id') id: string) {
    const result = await this.adminService.deleteKeyword(id);
    return { success: true, data: result };
  }

  // ==================== ADMISSION RULES MANAGEMENT ====================

  @Get('admission-rules')
  async getAllAdmissionRules(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.adminService.getAllAdmissionRules(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
    return { success: true, ...data };
  }

  @Post('admission-rules')
  async createAdmissionRule(
    @Body() input: { title: string; description: string; isActive?: boolean },
  ) {
    const rule = await this.adminService.createAdmissionRule(input);
    return { success: true, data: rule };
  }

  @Put('admission-rules/:id')
  async updateAdmissionRule(
    @Param('id') id: string,
    @Body() input: { title?: string; description?: string; isActive?: boolean },
  ) {
    const rule = await this.adminService.updateAdmissionRule(id, input);
    return { success: true, data: rule };
  }

  @Delete('admission-rules/:id')
  async deleteAdmissionRule(@Param('id') id: string) {
    const result = await this.adminService.deleteAdmissionRule(id);
    return { success: true, data: result };
  }

  // ==================== DUPLICATE DETECTION ====================

  @Get('duplicates/faculties')
  async detectDuplicateFaculties() {
    const result = await this.adminService.detectDuplicateFaculties();
    return { success: true, data: result };
  }

  @Get('duplicates/programmes')
  async detectDuplicateProgrammes() {
    const result = await this.adminService.detectDuplicateProgrammes();
    return { success: true, data: result };
  }

  @Get('duplicates/subjects')
  async detectDuplicateSubjects() {
    const result = await this.adminService.detectDuplicateSubjects();
    return { success: true, data: result };
  }

  // ==================== ANNOUNCEMENTS ====================

  @Post('announcements')
  async createAnnouncement(
    @Body() input: { title: string; content: string; programmeId?: string },
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
