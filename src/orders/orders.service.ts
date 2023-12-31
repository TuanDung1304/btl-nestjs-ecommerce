import { ForbiddenException, Injectable } from '@nestjs/common';
import { uniq } from 'lodash';
import { MIN_PRICE_TO_FREE_SHIP, SHIPMENT_COST } from 'src/orders/consts';
import { CreateOrderDto } from 'src/orders/dtos/createOrder.dto';
import { UpdateStatus } from 'src/orders/dtos/updateStatus.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async createOrder(dto: CreateOrderDto, userId: number) {
    const voucher = dto?.voucherCode
      ? await this.prisma.voucher.findUnique({
          where: { code: dto.voucherCode },
        })
      : null;
    if (dto?.voucherCode && !voucher) {
      throw new ForbiddenException('Voucher không tồn tại!');
    }
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId, orderId: null },
      select: {
        quantity: true,
        productModel: {
          select: {
            id: true,
            product: { select: { price: true, discountedPrice: true } },
            quantity: true,
          },
        },
      },
    });
    if (!cartItems?.length) {
      throw new ForbiddenException('Không có sản phẩm nào để đặt hàng');
    }

    const notEnough = cartItems.some(
      (item) => item.quantity > item.productModel.quantity,
    );
    if (notEnough) {
      throw new ForbiddenException('Không đủ sản phẩm trong kho');
    }

    const totalModelPrice = cartItems.reduce(
      (acc, item) =>
        acc +
        item.quantity *
          (item.productModel.product?.discountedPrice ??
            item.productModel.product.price),
      0,
    );

    const discountVoucher = voucher?.amount ?? 0;

    const shipmentPrice =
      totalModelPrice > MIN_PRICE_TO_FREE_SHIP ? 0 : SHIPMENT_COST;

    const totalPrice = totalModelPrice - discountVoucher + shipmentPrice;

    const order = await this.prisma.order.create({
      data: {
        userId,
        address: dto.address,
        district: dto.district,
        province: dto.province,
        totalPrice,
        shipmentPrice,
        voucherId: voucher?.id,
        note: dto?.note,
        paymentMethod: dto.paymentMethod,
      },
    });
    await this.prisma.cartItem.updateMany({
      where: { userId, orderId: null },
      data: {
        orderId: order.id,
      },
    });
    await this.prisma.$transaction(
      cartItems.map((item) =>
        this.prisma.productModel.update({
          where: {
            id: item.productModel.id,
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        }),
      ),
    );

    return {
      message: 'Đặt hàng thành công.',
      order: {
        id: order.id,
        totalPrice: order.totalPrice,
      },
    };
  }

  async getMyOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      select: {
        address: true,
        id: true,
        status: true,
        totalPrice: true,
        cartItems: { select: { quantity: true } },
        createdAt: true,
      },
    });

    return orders;
  }

  async adminGetOrders() {
    const orders = await this.prisma.order.findMany({
      select: {
        id: true,
        address: true,
        district: true,
        province: true,
        totalPrice: true,
        voucher: { select: { amount: true } },
        status: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        cartItems: {
          select: {
            quantity: true,
            productModel: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders.map(({ cartItems, user, voucher, ...rest }) => ({
      ...rest,
      totalModel: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      totalProduct: uniq(cartItems.map((item) => item.productModel.product.id))
        .length,
      userName: `${user.firstName} ${user.lastName}`,
      voucherDiscount: Number(voucher.amount),
    }));
  }

  async updateStatus({ orderId, status }: UpdateStatus) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });

    return {
      message: 'Cập nhật trạng thái thành công',
    };
  }

  async cancelOrder({ orderId }: { orderId: number }) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'Cancelled',
      },
    });

    return {
      message: 'Hủy đơn hàng thành công',
    };
  }
}
