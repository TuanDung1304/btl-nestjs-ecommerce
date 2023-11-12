import { Module } from '@nestjs/common';
import { UsersController } from 'src/user/users.controller';
import { UsersService } from 'src/user/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
