import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';
import { VouchersService } from 'src/vouchers/vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get('/:code')
  @HttpCode(HttpStatus.OK)
  getVoucher(
    @Param('code') code: string,
    @GetCurrentUser('sub') userId: number,
  ) {
    return this.vouchersService.getVoucher(code, userId);
  }
}
