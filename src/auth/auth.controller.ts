import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { LoginData, SignUpData } from 'src/auth/types/type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignUpDto): Promise<SignUpData> {
    return this.authService.signUp(dto);
  }

  @Get('/login')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginData> {
    return this.authService.login(dto);
  }
}
