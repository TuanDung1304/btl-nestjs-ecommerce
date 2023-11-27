import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';
import { AdminGuard } from 'src/common/guards/roles.guard';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser('sub') userId: number) {
    return this.usersService.getUserInfo(userId);
  }

  @Get('/listUsers')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  getUsers() {
    return this.usersService.getListUsers();
  }

  @Post('/userSeen')
  @HttpCode(HttpStatus.OK)
  setLastSeen(@GetCurrentUser('sub') userId: number) {
    return this.usersService.setLastSeen(userId);
  }
}
