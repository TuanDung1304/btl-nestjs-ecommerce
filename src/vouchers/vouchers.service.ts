import { ForbiddenException, Injectable } from '@nestjs/common';
import { Voucher } from '@prisma/client';
import { CartsService } from 'src/carts/carts.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(
    private prisma: PrismaService,
    private cartsService: CartsService,
  ) {}

  async getVoucher(code: string, userId: number): Promise<Voucher> {
    const voucher = await this.prisma.voucher.findUnique({ where: { code } });
    if (!voucher) {
      throw new ForbiddenException('Voucher không tồn tại');
    }
    const usedVoucher = await this.prisma.order.count({
      where: {
        voucher: { code },
      },
    });
    if (voucher.maxUser - usedVoucher < 1) {
      throw new ForbiddenException('Voucher đã hết lượt sử dụng');
    }

    const cartInfo = await this.cartsService.getCart(userId);
    if (cartInfo.totalPrice < voucher.minOrderPrice) {
      throw new ForbiddenException(
        `Giá trị đơn hàng tối thiếu là ${voucher.minOrderPrice.toLocaleString()}₫`,
      );
    }

    return voucher;
  }
}
