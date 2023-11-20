import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { AddCartDto } from 'src/carts/dtos/addCart.dto';
import { AdjustQuantityDto } from 'src/carts/dtos/adjustQuantity.dto';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post('/add')
  @HttpCode(HttpStatus.OK)
  addCartItem(@Body() dto: AddCartDto, @GetCurrentUser('sub') userId: number) {
    return this.cartsService.addCartItem(dto, userId);
  }

  @Get('/get')
  @HttpCode(HttpStatus.OK)
  getCart(@GetCurrentUser('sub') userId: number) {
    return this.cartsService.getCart(userId);
  }

  @Post('/update')
  @HttpCode(HttpStatus.OK)
  adjustQuantity(
    @GetCurrentUser('sub') userId: number,
    @Body() dto: AdjustQuantityDto,
  ) {
    return this.cartsService.adjustQuantity(userId, dto);
  }
}
