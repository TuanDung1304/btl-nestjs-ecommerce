import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/auth.dto';
import { SignUpData } from 'src/auth/types/type';
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
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) throw new ForbiddenException('Email already in use');

    if (dto.password !== dto.confirmPassword) {
      throw new ForbiddenException('The confirmed password is incorrect');
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
      message: 'Sign up successful',
      user: { email: newUser.email, id: newUser.id },
    };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
