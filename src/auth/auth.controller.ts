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
import { LoginDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { LoginData, SignUpData } from 'src/auth/types/type';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignUpDto): Promise<SignUpData> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('/login')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginData> {
    return this.authService.login(dto);
  }
}
