import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AtGuard } from 'src/common/guards/at.guard';
import { JwtModule } from '@nestjs/jwt';
import { CartsController } from './carts/carts.controller';
import { CartsService } from './carts/carts.service';
import { CartsModule } from './carts/carts.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';

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
