import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { LoginData, SignUpData } from 'src/auth/types/type';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<SignUpData> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) throw new ForbiddenException('Email đã tồn tại!');

    if (dto.password !== dto.confirmPassword) {
      throw new ForbiddenException('Mật khẩu xác nhận không đúng');
    }

    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      message: 'Đăng ký tài khoản thành công!',
      user: { email: newUser.email, id: newUser.id },
    };
  }

  async login(dto: LoginDto): Promise<LoginData> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('Tài khoản không tồn tại!');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đã bị khóa!');
    }

    const { email, password, id, role, avatar, firstName, lastName } = user;

    const passwordMatches = await bcrypt.compare(dto.password, password);
    if (!passwordMatches)
      throw new ForbiddenException('Mật khẩu không chính xác!');

    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(id, email, role, 'at'),
      this.getToken(id, email, role, 'rt'),
    ]);

    const hashRt = await this.hashData(refreshToken);
    await this.prisma.user.update({ where: { id }, data: { hashRt } });

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      message: 'Đăng nhập thành công',
      user: {
        id,
        email,
        role,
        avatar,
        firstName,
        lastName,
      },
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashRt: null },
    });

    return { message: 'Đăng xuất thành công' };
  }

  async refreshTokens(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('Tài khoản không tồn tại');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }

    const { id, email, role } = user;
    const [accessToken] = await Promise.all([
      this.getToken(id, email, role, 'at'),
      this.getToken(id, email, role, 'rt'),
    ]);

    return {
      accessToken,
      message: 'Refresh tokens successful',
    };
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async getToken(
    userId: number,
    email: string,
    role: Role,
    type: 'at' | 'rt',
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        role,
        email,
      },
      {
        secret:
          type === 'at'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET,
        expiresIn: type === 'at' ? '1h' : '1 days',
      },
    );
  }
}
