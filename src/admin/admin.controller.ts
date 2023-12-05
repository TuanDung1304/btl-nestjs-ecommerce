import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { CreateVoucherDto } from 'src/admin/dtos/createVoucher.dto';
import { UpdateUserStatus } from 'src/admin/dtos/updateUserStatus.dto';
import { UpdateVoucherDto } from 'src/admin/dtos/updateVoucher.dto';
import { AdminGuard } from 'src/common/guards/roles.guard';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/dashboard')
  @HttpCode(HttpStatus.OK)
  getDashboardData() {
    return this.adminService.getDashboard();
  }

  @Post('/update-user-status')
  @HttpCode(HttpStatus.OK)
  updateUserStatus(@Body() dto: UpdateUserStatus) {
    return this.adminService.updateUserStatus(dto);
  }

  @Post('/create-voucher')
  @HttpCode(HttpStatus.CREATED)
  createVoucher(@Body() dto: CreateVoucherDto) {
    return this.adminService.createVoucher(dto);
  }

  @Get('/vouchers')
  @HttpCode(HttpStatus.OK)
  getVouchers() {
    return this.adminService.getVouchers();
  }

  @Post('/edit-voucher')
  @HttpCode(HttpStatus.OK)
  updateVoucher(@Body() dto: UpdateVoucherDto) {
    return this.adminService.updateVoucher(dto);
  }
}
