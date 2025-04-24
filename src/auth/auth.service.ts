import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private generateAccessToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  }

  private async createRefreshToken(
    userId: number,
    ip?: string,
    userAgent?: string,
  ): Promise<string> {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.userToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    return refreshToken;
  }

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed },
    });

    return { accessToken: this.generateAccessToken(user.id, user.email) };
  }

  async login(email: string, password: string, req: Request, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Feil e-post eller passord');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Feil e-post eller passord');

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.createRefreshToken(
      user.id,
      req.ip,
      req.headers['user-agent'],
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) throw new UnauthorizedException('Mangler refresh-token');

    const user = await this.prisma.user.findFirst({
      where: {
        RefreshToken: { some: {} }, // riktig relasjonsnavn!
      },
      include: {
        RefreshToken: true,
      },
    });

    if (!user || !user.RefreshToken?.length)
      throw new UnauthorizedException('Ingen refresh-tokens');

    const validRefresh = user.RefreshToken.find((rt) =>
      bcrypt.compareSync(token, rt.tokenHash),
    );

    if (!validRefresh || validRefresh.expiresAt < new Date()) {
      throw new UnauthorizedException('Ugyldig eller utløpt refresh-token');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const newRefreshToken = await this.createRefreshToken(
      user.id,
      req.ip,
      req.headers['user-agent'],
    );

    await this.prisma.userToken.delete({
      where: { id: validRefresh.id },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async logout(res: Response) {
    res.clearCookie('refreshToken');
    // TODO: valgfritt – slett tokens fra db også
  }

  async getUserInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { permissions: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Bruker ikke funnet');

    const permissions = user.roles.flatMap((r) =>
      r.permissions.map((p) => p.key),
    );

    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      permissions: [...new Set(permissions)],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
