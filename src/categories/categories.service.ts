import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getProductsByCategory(categoryId: string) {
    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    return category.products;
  }
}
