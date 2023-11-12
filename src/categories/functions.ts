import { Products } from '@prisma/client';

export function getSortedBy(
  sortBy: 'default' | 'newest' | 'asc' | 'desc',
): Partial<Record<keyof Products, 'asc' | 'desc'>> {
  switch (sortBy) {
    case 'newest':
      return { createdAt: 'asc' };
    case 'asc':
      return { price: 'asc' };
    case 'desc':
      return { price: 'desc' };
    default:
      return {};
  }
}
