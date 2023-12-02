import * as bcrypt from 'bcrypt';
import {
  Images,
  Prisma,
  PrismaClient,
  ProductModel,
  Product,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

type Model = Pick<ProductModel, 'color' | 'productId' | 'quantity' | 'size'>;
type IProduct = Pick<
  Product,
  'id' | 'categoryId' | 'price' | 'name' | 'thumbnail' | 'views'
> & { description?: string; discountedPrice?: number };

enum COLORS {
  Red = 'Đỏ',
  Yellow = 'Vàng',
  Orange = 'Cam',
  Black = 'Đen',
  White = 'Trắng',
  Grey = 'Xám',
  Purple = 'Tím than',
  Blue = 'Xanh',
  Brown = 'Nâu',
  Cream = 'Kem',
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function getRandomColors(): string[] {
  // lay ngau nhien 3-6 mau ngau nhien
  const count = Math.floor(Math.random() * 4) + 3;
  const colors = Object.values(COLORS);
  const res: string[] = [];

  while (res.length < count) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (!res.includes(color)) {
      res.push(color);
    }
  }

  return res;
}

function getRandomSizes(): string[] {
  // lay ngau nhien 3-6 size ngau nhien
  const count = Math.floor(Math.random() * 4) + 3;
  const res: string[] = [];

  while (res.length < count) {
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    if (!res.includes(size)) {
      res.push(size);
    }
  }

  return res;
}

const fakeProductModels = (productId: number, colors?: string[]): Model[] => {
  // random so luong 0 - 20
  return getRandomSizes().reduce<Model[]>((acc, size) => {
    return [
      ...acc,
      ...(colors ?? getRandomColors()).map((color) => {
        const quantity = Math.floor(Math.random() * 20);
        return { color, size, quantity, productId };
      }),
    ];
  }, []);
};

const fakeImages = (
  productId: number,
  images: string[],
): Pick<Images, 'productId' | 'url'>[] => {
  return images.map((image) => ({ productId, url: image }));
};

// PRODUCT =============================
const AO_POLO: IProduct[] = [
  // ao polo
  {
    id: 101,
    categoryId: 'ao-polo',
    name: 'Áo Polo trơn hiệu ứng',
    description: 'Ao Polo',
    price: 450000,
    views: 100,
    thumbnail:
      'https://product.hstatic.net/200000690725/product/estp041-16_4cb9d42d84e7436884bd3f4e648621ed_master.jpg',
  },
  {
    id: 102,
    categoryId: 'ao-polo',
    name: 'Áo Polo trơn bo kẻ',
    description: 'Áo Polo len bo kẻ cổ',
    price: 500000,
    discountedPrice: 450000,
    views: 99,
    thumbnail:
      'https://product.hstatic.net/200000690725/product/5_66590d1cba6041359e8a89a1c7e0feb5_master.jpg',
  },
  {
    id: 103,
    categoryId: 'ao-polo',
    name: 'Áo Polo trơn bo kẻ',
    description: 'Áo Polo trơn bo kẻ',
    price: 420000,
    discountedPrice: 400000,
    views: 30,
    thumbnail:
      'https://product.hstatic.net/200000690725/product/1_50f16dbd5df34aa3acc99865b4820084_master.jpg',
  },
  {
    id: 104,
    categoryId: 'ao-polo',
    name: 'Áo Polo Cotton Bền Màu, Dễ Làm Sạch, Chống Nhăn, Co Giãn 7APCT007TRK',
    description:
      'Áo Polo Cotton Bền Màu, Dễ Làm Sạch, Chống Nhăn, Co Giãn 7APCT007TRK',
    price: 379000,
    discountedPrice: 169000,
    views: 189,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/2_04e7c89f41b0499a969d9ab2b8768f93_master.jpg',
  },
  {
    id: 105,
    categoryId: 'ao-polo',
    name: 'Áo Polo Thể Thao Dễ Làm Sạch, Chống Nhăn, Co Giãn 7APCB004DEN',
    description: 'Áo Polo trơn bo kẻ',
    price: 319000,
    discountedPrice: 169000,
    views: 98,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/san_pham__1__2c4f94dbfe6a4d9caf3905b66683c63e_master.jpg',
  },
];

const AO_SOMI: IProduct[] = [
  {
    id: 106,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Basic 7SMDH001GHS',
    description: 'Áo Sơ Mi Basic 7SMDH001GHS',
    price: 550000,
    views: 200,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/6_afe399af00a7441ba01c615fefd7095b_master.png',
  },
  {
    id: 107,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Basic 4SMDB003DEN',
    description: 'Áo Sơ Mi Basic 4SMDB003DEN',
    price: 480000,
    views: 85,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/5_7cea344525ca40a9a05d87ed01e2764e_master.png',
  },
  {
    id: 108,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Dài Tay Từ Sợi Tre Chống Nhăn, Kháng Khuẩn, Chống Tia UV',
    description:
      'Áo Sơ Mi Dài Tay Từ Sợi Tre Chống Nhăn, Kháng Khuẩn, Chống Tia UV',
    price: 495000,
    discountedPrice: 399000,
    views: 302,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/5_7cea344525ca40a9a05d87ed01e2764e_master.png',
  },
  {
    id: 109,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Dài Tay Từ Sợi Tre Bạc Hà Thấm Hút Tốt, Chống Nhăn',
    description: 'Áo Sơ Mi Dài Tay Từ Sợi Tre Bạc Hà Thấm Hút Tốt, Chống Nhăn',
    price: 489000,
    views: 23,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/1k__1000_x_1500_px___4__487603247e4949788ade60f9f1edc7da_master.jpg',
  },
];

const AO_VEST: IProduct[] = [];

const AO_KHOAC_GIO: IProduct[] = [
  {
    id: 111,
    categoryId: 'ao-khoac',
    name: 'Áo Khoác Gió 6AGBT003DEN 2 Lớp',
    description: 'Áo Khoác Gió 6AGBT003DEN 2 Lớp',
    price: 700000,
    views: 87,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/5_208a16d7eef8427bbdf69ded3b68a118_master.png',
  },
  {
    id: 112,
    categoryId: 'ao-khoac',
    name: 'Áo Khoác Da Lộn 2 Lớp Biluxury 6ADLB001VAB',
    description: 'Áo Khoác Da Lộn 2 Lớp Biluxury 6ADLB001VAB',
    price: 549000,
    views: 56,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/6_147c6b91c70244c7bf176320faf79e93_master.jpg',
  },
  {
    id: 113,
    categoryId: 'ao-khoac',
    name: 'Áo Khoác Phao Biluxury 6AKPT001XAH',
    description: 'Áo Khoác Phao Biluxury 6AKPT001XAH',
    price: 549000,
    views: 56,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/ao_giu_nhiet_cover_23_7619fb2ba1524370b706aeedd351b275_master.jpg',
  },
  {
    id: 114,
    categoryId: 'ao-khoac',
    name: 'Áo Khoác Phao Biluxury 6AKPT001DEN',
    description: 'Áo Khoác Phao Biluxury 6AKPT001DEN',
    price: 549000,
    views: 56,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/6akpt001den-999k_2___copy__e74d738cd55b4befa0fc544d67254316_master.jpg',
  },
  {
    id: 115,
    categoryId: 'ao-khoac',
    name: 'Áo Khoác Da Lộn 2 Lớp Biluxury 6ADLB001VAB',
    description: 'Áo Khoác Da Lộn 2 Lớp Biluxury 6ADLB001VAB',
    price: 549000,
    views: 56,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/6ag2t011den-795k_2___copy__e34ea1d7ef0c4bbeb96d0d9bae3badc1_master.jpg',
  },
];

// IMAGES ==========================
const IMAGES: Pick<Images, 'productId' | 'url'>[] = [
  ...fakeImages(101, [
    'https://product.hstatic.net/200000690725/product/estp041-16_4cb9d42d84e7436884bd3f4e648621ed_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-12_f4f5deac05fa47789c5897ba7a06818f_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-11_5cc08ee5a7f94d739d935b090e8657ce_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-15_0af52441e90e49aebae6f5874f100c2d_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-13_052acb199d294321a1158807cea0d5b4_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-14_c216ec36194c4f7da5d099aff22b8316_master.jpg',
  ]),
  ...fakeImages(102, [
    'https://product.hstatic.net/200000690725/product/5_66590d1cba6041359e8a89a1c7e0feb5_master.jpg',
    'https://product.hstatic.net/200000690725/product/1_eaabf57d435740af8ed20d6f40378045_master.jpg',
    'https://product.hstatic.net/200000690725/product/2_25c38d6c27394c258025535e2bc9d5bd_master.jpg',
    'https://product.hstatic.net/200000690725/product/6_e4d2cb26997d464985a485cc7f212599_master.jpg',
  ]),
  ...fakeImages(103, [
    'https://product.hstatic.net/200000690725/product/1_50f16dbd5df34aa3acc99865b4820084_master.jpg',
    'https://product.hstatic.net/200000690725/product/2_5933a603e4074662bfe7cc6b5fe1e44b_master.jpg',
    'https://product.hstatic.net/200000690725/product/4_aaa0fd53411a441e85605a458aab67f7_master.jpg',
    'https://product.hstatic.net/200000690725/product/5_5bf4a94b5b19485199441c580dae0f6a_master.jpg',
    'https://product.hstatic.net/200000690725/product/7_e37142ddf18d4daa898aac91aa82eb92_master.jpg',
  ]),
  ...fakeImages(104, [
    'https://product.hstatic.net/200000053174/product/3_5017e12e8b1b4538bbaa237b2da4b53f_master.jpg',
    'https://product.hstatic.net/200000053174/product/4_9404263f5acb435b92cd27578f61f229_master.jpg',
    'https://product.hstatic.net/200000053174/product/6_9c992b376f3a4c4db803018a8757bb07_master.jpg',
    'https://product.hstatic.net/200000053174/product/2_53388940b8174a688e1ddd934dbe9002_master.jpg',
    'https://product.hstatic.net/200000053174/product/4_75d035c1bb754e6e9014652e8f77d0b4_master.jpg',
  ]),
  ...fakeImages(105, [
    'https://product.hstatic.net/200000053174/product/9_1c4095155f7f43518734fd1aa5c8e676_master.png',
    'https://product.hstatic.net/200000053174/product/10_9c2737c21fd74e3c8b067557e6841521_master.png',
    'https://product.hstatic.net/200000053174/product/8_7e4f3472b8584fe2afd6eda2ea8f2e17_master.png',
    'https://product.hstatic.net/200000053174/product/3_d0e0cd51a27848f59335c219b130d556_master.jpg',
    'https://product.hstatic.net/200000053174/product/5_9c5440ad7aa24ec49df029051977121f_master.jpg',
  ]),
  ...fakeImages(106, [
    'https://product.hstatic.net/200000053174/product/5_bf05f79952a446788bd4d8574ea672ee_master.png',
    'https://product.hstatic.net/200000053174/product/6_afe399af00a7441ba01c615fefd7095b_master.png',
    'https://product.hstatic.net/200000053174/product/9_b3c8e2eb44074dd08c6555ad1a0f1501_master.png',
    'https://product.hstatic.net/200000053174/product/5_c641e62008214fd793a5a4b643745835_master.png',
    'https://product.hstatic.net/200000053174/product/6_ff3d6d674693479b8c05e430d240eb2b_master.png',
  ]),
  ...fakeImages(107, [
    'https://product.hstatic.net/200000053174/product/6_158578897c4148d2837cc5fdc831bf99_master.png',
    'https://product.hstatic.net/200000053174/product/9_b5dcfdd35d094c76a0b463d284c31933_master.png',
    'https://product.hstatic.net/200000053174/product/5_7cea344525ca40a9a05d87ed01e2764e_master.png',
  ]),
  ...fakeImages(108, [
    'https://product.hstatic.net/200000053174/product/6_88331ae0a99d4415b08c3d8d1dc9d506_master.jpg',
    'https://product.hstatic.net/200000053174/product/7_dd8bc247b2d343a2b10c5ab936246546_master.jpg',
    'https://product.hstatic.net/200000053174/product/8_0b408a6f9161406eaad4a46ee86650e7_master.jpg',
    'https://product.hstatic.net/200000053174/product/9_ae91a0e4d8ea4b23b1234b49ecae19b2_master.jpg',
    'https://product.hstatic.net/200000053174/product/11_a9f585b4d9144f15a522ad7392a0f7bd_master.jpg',
  ]),
  ...fakeImages(109, [
    'https://product.hstatic.net/200000053174/product/6_c44e210edb324e3db5d40e1d3d98e00a_master.jpg',
    'https://product.hstatic.net/200000053174/product/7_f1afc0dc69e448388f5d96a6c51231cf_master.jpg',
    'https://product.hstatic.net/200000053174/product/9_81c252afe81a423ba8fc55ccb7704ba9_master.jpg',
    'https://product.hstatic.net/200000053174/product/7_ad044db5849e49009f8c0d7b2d6c5261_master.jpg',
    'https://product.hstatic.net/200000053174/product/8_ed4ba083623846d2b48751386dbc0c8e_master.jpg',
    'https://product.hstatic.net/200000053174/product/6_edaf7bf755494b588a8288de10bd20db_master.jpg',
  ]),
  ...fakeImages(111, [
    'https://product.hstatic.net/200000053174/product/5_208a16d7eef8427bbdf69ded3b68a118_master.png',
    'https://product.hstatic.net/200000053174/product/6_08d71279b7894b4e89e915c571981a50_master.png',
    'https://product.hstatic.net/200000053174/product/4_3d965ce9804d4ab9a5e2210f252c8fda_master.png',
    'https://product.hstatic.net/200000053174/product/8_bb9e6833184142bda2b66d8702d5d108_master.png',
    'https://product.hstatic.net/200000053174/product/3_0f5dc8a341d247e5803b90dad85e43e7_master.png',
  ]),
  ...fakeImages(112, [
    'https://product.hstatic.net/200000053174/product/6_147c6b91c70244c7bf176320faf79e93_master.jpg',
    'https://product.hstatic.net/200000053174/product/7_7a6560a0e4f84c40bd5229028f78ecb8_master.jpg',
    'https://product.hstatic.net/200000053174/product/11_747da03c834f47dfa1d75eadca0a0fa7_master.jpg',
  ]),
  ...fakeImages(113, [
    'https://product.hstatic.net/200000053174/product/ao_giu_nhiet_cover_23_7619fb2ba1524370b706aeedd351b275_master.jpg',
    'https://product.hstatic.net/200000053174/product/6akpt001xah-999k._1___copy__302a6ff6b2904c2ca2889b555191154e_master.jpg',
    'https://product.hstatic.net/200000053174/product/ao_giu_nhiet_cover_23__1__49797122249c47c29bb1f2ddef66567f_master.jpg',
    'https://product.hstatic.net/200000053174/product/6akpt001xah-999k__copy__066cfed016d8435381a2792272b8ff60_master.jpg',
  ]),
  ...fakeImages(114, [
    'https://product.hstatic.net/200000053174/product/6akpt001den-999k_2___copy__e74d738cd55b4befa0fc544d67254316_master.jpg',
    'https://product.hstatic.net/200000053174/product/15_b5b101f1d5224fbd854d0a1db8a6ae25_master.jpg',
    'https://product.hstatic.net/200000053174/product/19_a3d31cd3cfb842c18e1d5a7076b827b6_master.jpg',
    'https://product.hstatic.net/200000053174/product/16_8aafbf349b574892bc8d51e23350a0a5_master.jpg',
  ]),
  ...fakeImages(115, [
    'https://product.hstatic.net/200000053174/product/6ag2t011den-795k_2___copy__e34ea1d7ef0c4bbeb96d0d9bae3badc1_master.jpg',
    'https://product.hstatic.net/200000053174/product/san_pham_764214fce50a4434a875629080e70a94_master.png',
    'https://product.hstatic.net/200000053174/product/6ag2t011den-795k__copy__2ccd1416b440491197ccc412acfd82c9_master.jpg',
    'https://product.hstatic.net/200000053174/product/18_57a9ce8aefa045e38a66c9c57da739b5_master.jpg',
  ]),
];

// MODELS ========================
const MODELS = [
  { color: 'Trắng', size: 'XS', quantity: 4, productId: 101 },
  { color: 'Kem', size: 'XS', quantity: 10, productId: 101 },
  { color: 'Đen', size: 'XS', quantity: 7, productId: 101 },
  { color: 'Trắng', size: 'L', quantity: 2, productId: 101 },
  { color: 'Kem', size: 'L', quantity: 0, productId: 101 },
  { color: 'Đen', size: 'L', quantity: 16, productId: 101 },
  { color: 'Trắng', size: 'M', quantity: 4, productId: 101 },
  { color: 'Kem', size: 'M', quantity: 7, productId: 101 },
  { color: 'Đen', size: 'M', quantity: 2, productId: 101 },
  { color: 'Trắng', size: 'S', quantity: 13, productId: 101 },
  { color: 'Kem', size: 'S', quantity: 9, productId: 101 },
  { color: 'Đen', size: 'S', quantity: 8, productId: 101 },
  { color: 'Đen', size: 'L', quantity: 18, productId: 102 },
  { color: 'Kem', size: 'L', quantity: 12, productId: 102 },
  { color: 'Đen', size: 'M', quantity: 1, productId: 102 },
  { color: 'Kem', size: 'M', quantity: 2, productId: 102 },
  { color: 'Đen', size: 'S', quantity: 18, productId: 102 },
  { color: 'Kem', size: 'S', quantity: 11, productId: 102 },
  { color: 'Đen', size: 'XS', quantity: 15, productId: 102 },
  { color: 'Kem', size: 'XS', quantity: 3, productId: 102 },
  { color: 'Đen', size: 'M', quantity: 16, productId: 103 },
  { color: 'Trắng', size: 'M', quantity: 17, productId: 103 },
  { color: 'Đen', size: 'XL', quantity: 7, productId: 103 },
  { color: 'Trắng', size: 'XL', quantity: 8, productId: 103 },
  { color: 'Đen', size: 'L', quantity: 5, productId: 103 },
  { color: 'Trắng', size: 'L', quantity: 7, productId: 103 },
  { color: 'Đen', size: 'XS', quantity: 5, productId: 103 },
  { color: 'Trắng', size: 'XS', quantity: 3, productId: 103 },
  { color: 'Xanh', size: 'XS', quantity: 8, productId: 104 },
  { color: 'Nâu', size: 'XS', quantity: 16, productId: 104 },
  { color: 'Đen', size: 'XS', quantity: 3, productId: 104 },
  { color: 'Xanh', size: 'L', quantity: 7, productId: 104 },
  { color: 'Nâu', size: 'L', quantity: 4, productId: 104 },
  { color: 'Đen', size: 'L', quantity: 6, productId: 104 },
  { color: 'Xanh', size: 'XL', quantity: 17, productId: 104 },
  { color: 'Nâu', size: 'XL', quantity: 18, productId: 104 },
  { color: 'Đen', size: 'XL', quantity: 0, productId: 104 },
  { color: 'Kem', size: 'M', quantity: 5, productId: 105 },
  { color: 'Cam', size: 'M', quantity: 11, productId: 105 },
  { color: 'Kem', size: 'XL', quantity: 6, productId: 105 },
  { color: 'Cam', size: 'XL', quantity: 10, productId: 105 },
  { color: 'Kem', size: 'S', quantity: 0, productId: 105 },
  { color: 'Cam', size: 'S', quantity: 4, productId: 105 },
  { color: 'Xanh', size: 'S', quantity: 10, productId: 106 },
  { color: 'Xám', size: 'S', quantity: 10, productId: 106 },
  { color: 'Xanh', size: 'XS', quantity: 9, productId: 106 },
  { color: 'Xám', size: 'XS', quantity: 2, productId: 106 },
  { color: 'Xanh', size: 'L', quantity: 3, productId: 106 },
  { color: 'Xám', size: 'L', quantity: 3, productId: 106 },
  { color: 'Xanh', size: 'XL', quantity: 1, productId: 106 },
  { color: 'Xám', size: 'XL', quantity: 15, productId: 106 },
  { color: 'Kem', size: 'M', quantity: 7, productId: 107 },
  { color: 'Xanh', size: 'M', quantity: 2, productId: 107 },
  { color: 'Xanh', size: 'M', quantity: 19, productId: 107 },
  { color: 'Xám', size: 'M', quantity: 7, productId: 107 },
  { color: 'Trắng', size: 'M', quantity: 19, productId: 107 },
  { color: 'Tím than', size: 'M', quantity: 11, productId: 107 },
  { color: 'Xám', size: 'L', quantity: 17, productId: 107 },
  { color: 'Xanh', size: 'L', quantity: 15, productId: 107 },
  { color: 'Xanh', size: 'L', quantity: 3, productId: 107 },
  { color: 'Trắng', size: 'L', quantity: 11, productId: 107 },
  { color: 'Trắng', size: 'XL', quantity: 12, productId: 107 },
  { color: 'Xanh', size: 'XL', quantity: 1, productId: 107 },
  { color: 'Kem', size: 'XL', quantity: 14, productId: 107 },
  { color: 'Cam', size: 'XL', quantity: 14, productId: 107 },
  { color: 'Đen', size: 'XL', quantity: 10, productId: 107 },
  { color: 'Đen', size: 'L', quantity: 16, productId: 108 },
  { color: 'Tím than', size: 'L', quantity: 14, productId: 108 },
  { color: 'Đen', size: 'S', quantity: 14, productId: 108 },
  { color: 'Tím than', size: 'S', quantity: 18, productId: 108 },
  { color: 'Đen', size: 'XL', quantity: 4, productId: 108 },
  { color: 'Tím than', size: 'XL', quantity: 15, productId: 108 },
  { color: 'Đen', size: 'M', quantity: 4, productId: 109 },
  { color: 'Xám', size: 'M', quantity: 7, productId: 109 },
  { color: 'Đen', size: 'XL', quantity: 4, productId: 109 },
  { color: 'Xám', size: 'XL', quantity: 17, productId: 109 },
  { color: 'Đen', size: 'XS', quantity: 11, productId: 109 },
  { color: 'Xám', size: 'XS', quantity: 8, productId: 109 },
  { color: 'Đen', size: 'L', quantity: 9, productId: 109 },
  { color: 'Xám', size: 'L', quantity: 4, productId: 109 },
  { color: 'Xanh', size: 'L', quantity: 3, productId: 111 },
  { color: 'Nâu', size: 'L', quantity: 10, productId: 111 },
  { color: 'Đen', size: 'L', quantity: 7, productId: 111 },
  { color: 'Xanh', size: 'XL', quantity: 16, productId: 111 },
  { color: 'Nâu', size: 'XL', quantity: 6, productId: 111 },
  { color: 'Đen', size: 'XL', quantity: 12, productId: 111 },
  { color: 'Xanh', size: 'S', quantity: 6, productId: 111 },
  { color: 'Nâu', size: 'S', quantity: 3, productId: 111 },
  { color: 'Đen', size: 'S', quantity: 18, productId: 111 },
  { color: 'Xám', size: 'XL', quantity: 1, productId: 112 },
  { color: 'Nâu', size: 'XL', quantity: 3, productId: 112 },
  { color: 'Đen', size: 'XL', quantity: 5, productId: 112 },
  { color: 'Xám', size: 'M', quantity: 9, productId: 112 },
  { color: 'Nâu', size: 'M', quantity: 9, productId: 112 },
  { color: 'Đen', size: 'M', quantity: 4, productId: 112 },
  { color: 'Xám', size: 'S', quantity: 14, productId: 112 },
  { color: 'Nâu', size: 'S', quantity: 2, productId: 112 },
  { color: 'Đen', size: 'S', quantity: 14, productId: 112 },
  { color: 'Xanh', size: 'XL', quantity: 17, productId: 113 },
  { color: 'Trắng', size: 'XL', quantity: 14, productId: 113 },
  { color: 'Đen', size: 'XL', quantity: 13, productId: 113 },
  { color: 'Xanh', size: 'M', quantity: 19, productId: 113 },
  { color: 'Trắng', size: 'M', quantity: 15, productId: 113 },
  { color: 'Đen', size: 'M', quantity: 14, productId: 113 },
  { color: 'Xanh', size: 'S', quantity: 0, productId: 113 },
  { color: 'Trắng', size: 'S', quantity: 4, productId: 113 },
  { color: 'Đen', size: 'S', quantity: 15, productId: 113 },
  { color: 'Xanh', size: 'L', quantity: 16, productId: 113 },
  { color: 'Trắng', size: 'L', quantity: 4, productId: 113 },
  { color: 'Đen', size: 'L', quantity: 6, productId: 113 },
  { color: 'Xanh', size: 'XS', quantity: 14, productId: 113 },
  { color: 'Trắng', size: 'XS', quantity: 16, productId: 113 },
  { color: 'Đen', size: 'XS', quantity: 19, productId: 113 },
  { color: 'Kem', size: 'XL', quantity: 12, productId: 114 },
  { color: 'Trắng', size: 'XL', quantity: 8, productId: 114 },
  { color: 'Đen', size: 'XL', quantity: 16, productId: 114 },
  { color: 'Kem', size: 'L', quantity: 13, productId: 114 },
  { color: 'Trắng', size: 'L', quantity: 19, productId: 114 },
  { color: 'Đen', size: 'L', quantity: 11, productId: 114 },
  { color: 'Kem', size: 'M', quantity: 15, productId: 114 },
  { color: 'Trắng', size: 'M', quantity: 18, productId: 114 },
  { color: 'Đen', size: 'M', quantity: 3, productId: 114 },
  { color: 'Xám', size: 'S', quantity: 7, productId: 115 },
  { color: 'Trắng', size: 'S', quantity: 0, productId: 115 },
  { color: 'Đen', size: 'S', quantity: 10, productId: 115 },
  { color: 'Xám', size: 'M', quantity: 9, productId: 115 },
  { color: 'Trắng', size: 'M', quantity: 8, productId: 115 },
  { color: 'Đen', size: 'M', quantity: 16, productId: 115 },
  { color: 'Xám', size: 'L', quantity: 10, productId: 115 },
  { color: 'Trắng', size: 'L', quantity: 13, productId: 115 },
  { color: 'Đen', size: 'L', quantity: 4, productId: 115 },
  { color: 'Xám', size: 'XL', quantity: 5, productId: 115 },
  { color: 'Trắng', size: 'XL', quantity: 6, productId: 115 },
  { color: 'Đen', size: 'XL', quantity: 15, productId: 115 },
  { color: 'Xám', size: 'XS', quantity: 14, productId: 115 },
  { color: 'Trắng', size: 'XS', quantity: 10, productId: 115 },
  { color: 'Đen', size: 'XS', quantity: 17, productId: 115 },
];

// console.log(fakeProductModels(115, [COLORS.Grey, COLORS.White, COLORS.Black]));

/**
 Prisma ======================================
 */
const prisma = new PrismaClient();

async function main() {
  // user-------------------------------
  const usersData: Prisma.UserCreateManyInput[] = [];
  usersData.push({
    email: 'admin@gmail.com',
    firstName: 'Tuan Dung',
    lastName: 'Nguyen',
    password: await bcrypt.hash('123456', 10),
    avatar: faker.internet.avatar(),
    phone: '0383338589',
    address: 'Cau Giay',
    birthday: new Date('2001-04-13'),
    role: 'Admin',
  });
  usersData.push({
    email: 'tuandung13401@gmail.com',
    firstName: 'Tuan Dung',
    lastName: 'Nguyen',
    password: await bcrypt.hash('123456', 10),
    avatar: faker.internet.avatar(),
    phone: '0393336189',
    address: 'Cau Giay',
    birthday: new Date('2001-04-13'),
  });
  for (let i = 0; i < 20; i++) {
    usersData.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await bcrypt.hash('seeding', 10),
      avatar: faker.internet.avatar(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      birthday: faker.date.birthdate(),
    });
  }
  await prisma.user.createMany({
    skipDuplicates: true,
    data: usersData,
  });

  // categories-------------------------------
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Áo Polo', id: 'ao-polo', type: 'Áo' },
      { name: 'Áo Sơ Mi', id: 'ao-so-mi', type: 'Áo' },
      { name: 'Áo Khoác', id: 'ao-khoac', type: 'Áo' },
      { name: 'Áo Vest', id: 'ao-vest', type: 'Áo' },
      { name: 'Quần Jean', id: 'quan-jean', type: 'Quần' },
      { name: 'Quần Tây', id: 'quan-tay', type: 'Quần' },
      { name: 'Quần Kaki', id: 'quan-kaki', type: 'Quần' },
      { name: 'Quần Đùi', id: 'quan-gio', type: 'Quần' },
      { name: 'Giày', id: 'giay', type: 'Phụ Kiện' },
    ],
  });

  // products-------------------------------
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [...AO_POLO, ...AO_SOMI, ...AO_KHOAC_GIO],
  });

  //images-------------------------------
  await prisma.images.createMany({
    skipDuplicates: true,
    data: IMAGES,
  });

  // product models----------------------
  await prisma.productModel.createMany({
    skipDuplicates: true,
    data: MODELS,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
