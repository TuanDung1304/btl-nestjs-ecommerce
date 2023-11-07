import * as bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();
async function main() {
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
