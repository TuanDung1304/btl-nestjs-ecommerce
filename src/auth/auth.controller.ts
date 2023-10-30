import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto/auth.dto';
import { SignUpData } from 'src/auth/types/type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignUpDto): Promise<SignUpData> {
    return this.authService.signUp(dto);
  }
}
