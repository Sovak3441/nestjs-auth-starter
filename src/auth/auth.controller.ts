import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@CurrentUser() user: { userId: number }) {
    return this.auth.getUserInfo(user.userId);
  }

  @Post('register')
  register(@Body() body: RegisterAuthDto) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginAuthDto,  @Req() req: Request, @Res() res: Response) {
    return this.auth.login(body.email, body.password, req, res);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.auth.refresh(req, res);
  }
}
