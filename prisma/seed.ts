import * as bcrypt from 'bcrypt';
import {
  Images,
  Prisma,
  PrismaClient,
  ProductModels,
  Products,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

type Model = Pick<ProductModels, 'color' | 'productId' | 'quantity' | 'size'>;
type Product = Pick<
  Products,
  'id' | 'categoryId' | 'price' | 'name' | 'thumbnail'
> & { description?: string; discountedPrice?: number };

enum COLORS {
  Do = 'Đỏ',
  Vang = 'Vàng',
  Cam = 'Cam',
  Den = 'Đen',
  Trang = 'Trắng',
  Xam = 'Xám',
  Tim = 'Tím than',
  XanhThan = 'Xanh than',
  Xanh = 'Xanh',
  Nau = 'Nâu',
  TrangKem = 'Trắng kem',
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const prisma = new PrismaClient();

async function main() {
  // user-------------------------------
  const usersData: Prisma.UsersCreateManyInput[] = [];
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
  await prisma.users.createMany({
    skipDuplicates: true,
    data: usersData,
  });

  // categories-------------------------------
  await prisma.categories.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Áo Polo', id: 'ao-polo', type: 'Áo' },
      { name: 'Áo Sơ Mi', id: 'ao-so-mi', type: 'Áo' },
      { name: 'Áo Khoác', id: 'ao-khoac', type: 'Áo' },
      { name: 'Áo Phông', id: 'ao-phong', type: 'Áo' },
      { name: 'Áo Len', id: 'ao-len', type: 'Áo' },
      { name: 'Áo Vest', id: 'ao-vest', type: 'Áo' },
      { name: 'Quần Jean', id: 'quan-jean', type: 'Quần' },
      { name: 'Quần Tây', id: 'quan-tay', type: 'Quần' },
      { name: 'Quần Kaki', id: 'quan-kaki', type: 'Quần' },
      { name: 'Quần Đùi', id: 'quan-gio', type: 'Quần' },
      { name: 'Giày', id: 'giay', type: 'Phụ Kiện' },
      { name: 'Dây Lưng', id: 'day-lung', type: 'Phụ Kiện' },
      { name: 'Ví', id: 'vi', type: 'Phụ Kiện' },
    ],
  });

  // products
  await prisma.products.createMany({
    skipDuplicates: true,
    data: [...AO_POLO, ...AO_SOMI],
  });

  //images
  await prisma.images.createMany({
    skipDuplicates: true,
    data: IMAGES,
  });

  // product models
  await prisma.productModels.createMany({
    skipDuplicates: true,
    data: [
      ...fakeProductModels(101, [
        COLORS.Trang,
        COLORS.TrangKem,
        COLORS.Den,
        COLORS.XanhThan,
      ]),
      ...fakeProductModels(102, [COLORS.Den, COLORS.TrangKem]),
      ...fakeProductModels(103, [COLORS.Den, COLORS.TrangKem]),
      ...fakeProductModels(104, [COLORS.Den, COLORS.Trang]),
      ...fakeProductModels(105, [COLORS.Den, COLORS.Trang]),
      ...fakeProductModels(106, [COLORS.Xam, COLORS.Xanh]),
      ...fakeProductModels(107, [COLORS.Den]),
      ...fakeProductModels(107, [COLORS.Xanh]),
      ...fakeProductModels(107, [COLORS.Xanh, COLORS.Xam]),
    ],
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
  return getRandomSizes().reduce<Model[]>((acc, size) => {
    // random so luong 0 - 100
    return [
      ...acc,
      ...(colors ?? getRandomColors()).map((color) => {
        const quantity = Math.floor(Math.random() * 100);
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

// PRODUCT MODELS =============================
const AO_POLO: Product[] = [
  // ao polo
  {
    id: 101,
    categoryId: 'ao-polo',
    name: 'Áo Polo trơn hiệu ứng',
    description: 'Ao Polo',
    price: 450000,
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
    thumbnail:
      'https://product.hstatic.net/200000053174/product/san_pham__1__2c4f94dbfe6a4d9caf3905b66683c63e_master.jpg',
  },
];

const AO_SOMI: Product[] = [
  {
    id: 106,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Basic 7SMDH001GHS',
    description: 'Áo Sơ Mi Basic 7SMDH001GHS',
    price: 550000,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/6_afe399af00a7441ba01c615fefd7095b_master.png',
  },
  {
    id: 107,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Basic 4SMDB003DEN',
    description: 'Áo Sơ Mi Basic 4SMDB003DEN',
    price: 480000,
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
    thumbnail:
      'https://product.hstatic.net/200000053174/product/5_7cea344525ca40a9a05d87ed01e2764e_master.png',
  },
  {
    id: 109,
    categoryId: 'ao-so-mi',
    name: 'Áo Sơ Mi Dài Tay Từ Sợi Tre Bạc Hà Thấm Hút Tốt, Chống Nhăn',
    description: 'Áo Sơ Mi Dài Tay Từ Sợi Tre Bạc Hà Thấm Hút Tốt, Chống Nhăn',
    price: 489000,
    thumbnail:
      'https://product.hstatic.net/200000053174/product/1k__1000_x_1500_px___4__487603247e4949788ade60f9f1edc7da_master.jpg',
  },
];

// IMAGES =======================
const IMAGES: Pick<Images, 'productId' | 'url'>[] = [
  ...fakeImages(101, [
    'https://product.hstatic.net/200000690725/product/estp041-16_4cb9d42d84e7436884bd3f4e648621ed_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-12_f4f5deac05fa47789c5897ba7a06818f_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-11_5cc08ee5a7f94d739d935b090e8657ce_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-15_0af52441e90e49aebae6f5874f100c2d_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-13_052acb199d294321a1158807cea0d5b4_master.jpg',
    'https://product.hstatic.net/200000690725/product/estp041-14_c216ec36194c4f7da5d099aff22b8316_master.jpg',
  ]),
  //---------------------
  ...fakeImages(102, [
    'https://product.hstatic.net/200000690725/product/5_66590d1cba6041359e8a89a1c7e0feb5_master.jpg',
    'https://product.hstatic.net/200000690725/product/1_eaabf57d435740af8ed20d6f40378045_master.jpg',
    'https://product.hstatic.net/200000690725/product/2_25c38d6c27394c258025535e2bc9d5bd_master.jpg',
    'https://product.hstatic.net/200000690725/product/6_e4d2cb26997d464985a485cc7f212599_master.jpg',
  ]),
  //---------------------
  ...fakeImages(103, [
    'https://product.hstatic.net/200000690725/product/1_50f16dbd5df34aa3acc99865b4820084_master.jpg',
    'https://product.hstatic.net/200000690725/product/2_5933a603e4074662bfe7cc6b5fe1e44b_master.jpg',
    'https://product.hstatic.net/200000690725/product/4_aaa0fd53411a441e85605a458aab67f7_master.jpg',
    'https://product.hstatic.net/200000690725/product/5_5bf4a94b5b19485199441c580dae0f6a_master.jpg',
    'https://product.hstatic.net/200000690725/product/7_e37142ddf18d4daa898aac91aa82eb92_master.jpg',
  ]),
  //---------------------
  ...fakeImages(104, [
    'https://product.hstatic.net/200000053174/product/3_5017e12e8b1b4538bbaa237b2da4b53f_master.jpg',
    'https://product.hstatic.net/200000053174/product/4_9404263f5acb435b92cd27578f61f229_master.jpg',
    'https://product.hstatic.net/200000053174/product/6_9c992b376f3a4c4db803018a8757bb07_master.jpg',
    'https://product.hstatic.net/200000053174/product/2_53388940b8174a688e1ddd934dbe9002_master.jpg',
    'https://product.hstatic.net/200000053174/product/4_75d035c1bb754e6e9014652e8f77d0b4_master.jpg',
  ]),
  //---------------------
  ...fakeImages(105, [
    'https://product.hstatic.net/200000053174/product/9_1c4095155f7f43518734fd1aa5c8e676_master.png',
    'https://product.hstatic.net/200000053174/product/10_9c2737c21fd74e3c8b067557e6841521_master.png',
    'https://product.hstatic.net/200000053174/product/8_7e4f3472b8584fe2afd6eda2ea8f2e17_master.png',
    'https://product.hstatic.net/200000053174/product/3_d0e0cd51a27848f59335c219b130d556_master.jpg',
    'https://product.hstatic.net/200000053174/product/5_9c5440ad7aa24ec49df029051977121f_master.jpg',
  ]),
  //---------------------
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
];
