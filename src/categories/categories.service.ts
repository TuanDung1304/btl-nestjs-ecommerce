import { ForbiddenException, Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    const category = await this.prismaService.categories.findUnique({
      where: { id: dto.id },
    });
    if (category) {
      throw new ForbiddenException('Category already exists');
    }
    const newCategory = await this.prismaService.categories.create({
      data: { id: dto.id, name: dto.name, type: dto.type },
    });

    return {
      id: newCategory.id,
      name: newCategory.name,
    };
  }

  async getProductsByCategory(categoryId: string) {
    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    return category?.products ?? [];
  }
}
