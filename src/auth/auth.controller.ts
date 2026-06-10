import {
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('test')
  test() {

    return {
      message: 'Auth Working',
    };

  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ) {

    return this.authService.login(
      dto.email,
      dto.password,
    );

  }

}