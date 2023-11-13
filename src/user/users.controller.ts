import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UsersService } from 'src/user/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser('sub') userId: number) {
    return this.usersService.getUserInfo(userId);
  }
}
