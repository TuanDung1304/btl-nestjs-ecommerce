import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { AddCartDto } from 'src/carts/dtos/addCart.dto';
import { GetCurrentUser } from 'src/common/decorators/currentUser.decorator';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post('/add')
  @HttpCode(HttpStatus.OK)
  addCartItem(@Body() dto: AddCartDto, @GetCurrentUser('sub') userId: number) {
    return this.cartsService.addCartItem(dto, userId);
  }
}
