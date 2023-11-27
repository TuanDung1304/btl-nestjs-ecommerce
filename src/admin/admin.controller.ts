import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AdminGuard } from 'src/common/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/dashboard')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  getDashboardData() {
    return this.adminService.getDashboard();
  }
}
