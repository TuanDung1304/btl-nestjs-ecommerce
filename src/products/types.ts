export interface ListProductsData {
  id: number;
  name: string;
  categoryId: string;
  price: number;
  thumbnail: string;
  discountedPrice: number;
  createdAt: Date;
  inStock: number;
  modelsCount: number;
}
