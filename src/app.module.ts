import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AtGuard } from 'src/common/guards/at.guard';
import { JwtModule } from '@nestjs/jwt';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    PrismaModule,
    ProductsModule,
    CategoriesModule,
    UsersModule,
    CartsModule,
    OrdersModule,
    AdminModule,
    VouchersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
