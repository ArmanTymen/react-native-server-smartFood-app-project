import { PrismaClient } from '@prisma/client';
// @ts-ignore
import seedData from './seedData.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // Очистка в правильном порядке
  try {
    await prisma.favorites.deleteMany();
  } catch (e) { console.log('Favorites table not exists yet') }
  
  try {
    await prisma.personalRation.deleteMany();
  } catch (e) { console.log('PersonalRation table not exists yet') }
  
  try {
    await prisma.article.deleteMany();
  } catch (e) { console.log('Articles table not exists yet') }
  
  try {
    await prisma.category.deleteMany();
  } catch (e) { console.log('Categories table not exists yet') }
  
  try {
    await prisma.user.deleteMany();
  } catch (e) { console.log('Users table not exists yet') }

  // Только категории и статьи
  for (const category of seedData) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        articles: {
          create: category.articles.map((article: any) => ({
            title: article.title,
            content: article.content || "Содержание статьи..."
          }))
        }
      }
    });
    console.log(`✅ Создана категория: ${createdCategory.name}`);
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });