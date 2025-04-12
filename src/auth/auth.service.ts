import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(email: string, password: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashed: string = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Feil e-post eller passord');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Feil e-post eller passord');

    return this.generateTokens(user.id, user.email);
  }

  async refresh(token: string) {
    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as JwtPayload;

      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Ugyldig refresh-token');
    }
  }
}
