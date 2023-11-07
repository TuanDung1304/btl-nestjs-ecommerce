import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { LoginData, SignUpData } from 'src/auth/types/type';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<SignUpData> {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (user) throw new ForbiddenException('Email already in use');

    if (dto.password !== dto.confirmPassword) {
      throw new ForbiddenException('The confirmed password is incorrect');
    }

    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      message: 'Sign up successful',
      user: { email: newUser.email, id: newUser.id },
    };
  }

  async login(dto: LoginDto): Promise<LoginData> {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Account does not exist');

    const { email, password, id, role, avatar, firstName } = user;

    const passwordMatches = await bcrypt.compare(dto.password, password);
    if (!passwordMatches) throw new ForbiddenException('Wrong password');

    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(id, email, 'at'),
      this.getToken(id, email, 'rt'),
    ]);

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      message: 'Login successful',
      user: {
        id,
        email,
        role,
        avatar,
        firstName,
      },
    };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getToken(userId: number, email: string, type: 'at' | 'rt') {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret:
          type === 'at'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET,
        expiresIn: type === 'at' ? 600 : 3600,
      },
    );
  }
}
