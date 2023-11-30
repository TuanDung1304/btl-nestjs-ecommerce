import { ForbiddenException, Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { FilterDto } from 'src/categories/dto/filter.dto';
import { getSortedBy } from 'src/categories/functions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id: dto.id },
    });
    if (category) {
      throw new ForbiddenException('Danh mục không tồn tại');
    }
    const newCategory = await this.prismaService.category.create({
      data: { id: dto.id, name: dto.name, type: dto.type },
    });

    return {
      id: newCategory.id,
      name: newCategory.name,
    };
  }

  async getProductsByCategory(categoryId: string, filter?: FilterDto) {
    const { page, perPage, min, max, size, color } = filter;
    const type =
      categoryId === 'ao-nam'
        ? 'Áo'
        : categoryId === 'quan-nam'
        ? 'Quần'
        : categoryId === 'phu-kien'
        ? 'Phụ Kiện'
        : null;

    const conditions = {
      ...(type ? { category: { type } } : { categoryId }),
      productModels: {
        some: {
          color: { contains: color },
          ...(size ? { size: { equals: size } } : {}),
        },
      },
      OR: [
        {
          AND: [
            { discountedPrice: { not: { equals: null } } },
            { discountedPrice: { lte: max } },
            { discountedPrice: { gte: min } },
          ],
        },
        {
          AND: [
            { discountedPrice: { equals: null } },
            { price: { lte: max } },
            { price: { gte: min } },
          ],
        },
      ],
    };
    const totalProducts = await this.prismaService.product.count({
      where: {
        ...conditions,
      },
    });
    const products = await this.prismaService.product.findMany({
      where: conditions,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: getSortedBy(filter.sortBy),
    });
    return { products, totalPage: Math.ceil(totalProducts / perPage) };
  }
}
