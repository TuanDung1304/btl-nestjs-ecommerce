import { ForbiddenException, Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { FilterDto } from 'src/categories/dto/filter.dto';
import { getSortedBy } from 'src/categories/functions';
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

  async getProductsByCategory(categoryId: string, filter?: FilterDto) {
    const { page, perPage } = filter;
    const totalProducts = await this.prismaService.products.count({
      where: { categoryId },
    });
    const products = await this.prismaService.products.findMany({
      where: {
        categoryId,
        productModels: { some: { color: { contains: filter.color } } },
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: getSortedBy(filter.sortBy),
    });
    return { products, totalPage: Math.ceil(totalProducts / perPage) };
  }

  async getProductsByCategoryType(
    type: 'Áo' | 'Quần' | 'Phụ Kiện',
    filter: FilterDto,
  ) {
    const { page, perPage } = filter;
    const totalProducts = await this.prismaService.products.count({
      where: {
        category: { type },
      },
    });
    const products = await this.prismaService.products.findMany({
      where: {
        category: { type },
      },
      orderBy: getSortedBy(filter.sortBy),
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return { products, totalPage: Math.ceil(totalProducts / perPage) };
  }
}
