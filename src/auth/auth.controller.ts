import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

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
