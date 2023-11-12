import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/userid.decorator';
import { UsersService } from 'src/user/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUserId() userId: number) {
    return this.usersService.getUserInfo(userId);
  }
}
