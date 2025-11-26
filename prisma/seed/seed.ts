import { PrismaClient } from '../generated/prisma/client';
import seedData from './seedData.json';

const prisma = new PrismaClient();
interface SeedArticle {
  title: string;
  content?: string;
}

interface SeedCategory {
  name: string;
  articles: SeedArticle[];
}
async function main() {
  console.log('🌱 Start seeding...');

  await prisma.article.deleteMany();
  await prisma.category.deleteMany();

  for (const category of seedData as SeedCategory[]) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        articles: {
          create: category.articles.map(article => ({
            title: article.title,
            content: article.content || ""
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
