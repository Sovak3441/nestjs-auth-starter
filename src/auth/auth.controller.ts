import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  me(@CurrentUser() user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }

  @Post('register')
  register(@Body() body: RegisterAuthDto) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginAuthDto) {
    return this.auth.login(body.email, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }
}
