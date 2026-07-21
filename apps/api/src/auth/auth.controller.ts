import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    const result = await this.authService.register(input);
    return { success: true, data: result };
  }

  @Post('login')
  async login(
    @Body()
    input: {
      email: string;
      password: string;
    },
  ) {
    const result = await this.authService.login(input);
    return { success: true, data: result };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.sub);
    return { success: true, data: user };
  }
}

