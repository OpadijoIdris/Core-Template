import 'dotenv/config';
import prisma from '../src/config/postgres.js';
import pkg from '@prisma/client';
const { Role, ProductStatus, OrderStatus, PaymentProvider, PaymentStatus, ConversationStatus, MessageSenderRole } = pkg;
import bcrypt from 'bcrypt';

async function main() {
  console.log('--- [DEBUG] Seed Script Started ---');
  
  let url = process.env.DATABASE_URL;
  if (url) {
    url = url.trim().replace(/^["'](.+)["']$/, '$1');
    console.log('--- [DEBUG] DATABASE_URL Length:', url.length);
    try {
      const dbUrl = new URL(url);
      console.log('--- [DEBUG] DB Hostname:', dbUrl.hostname);
    } catch (e) {}
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  console.log('--- [DEBUG] Upserting Admin User... ---');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      firstName: 'Coree',
      lastName: 'Admin',
    },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      firstName: 'Coree',
      lastName: 'Admin',
    },
  });
  console.log('Admin user upserted:', admin.email);

  // 1. Clean other data (Optional, but let's keep it clean for demo)
  try {
    console.log('--- [DEBUG] Cleaning Other Tables... ---');
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.orderAudit.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.category.deleteMany();
    // We don't delete users here because we just upserted the admin
    await prisma.user.deleteMany({
      where: {
        NOT: { email: 'admin@example.com' }
      }
    });
    console.log('Other data cleared.');
  } catch (error) {
    console.log('--- [DEBUG] Error clearing tables:', error.message);
  }

  // 2. Create Regular Users
  const userEmails = ['john@example.com', 'jane@example.com', 'bob@example.com'];
  const createdUsers = [];
  for (const email of userEmails) {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.USER,
        isVerified: true,
        firstName: email.split('@')[0],
        lastName: 'Customer',
      },
    });
    createdUsers.push(user);
  }
  console.log('Customers created.');

  // 3. Create Categories and Subcategories
  const catJewelry = await prisma.category.create({
    data: {
      name: 'Jewelry', slug: 'jewelry',
      subCategories: { create: [{ name: 'Rings', slug: 'rings' }, { name: 'Necklaces', slug: 'necklaces' }] }
    },
    include: { subCategories: true }
  });

  const catWatches = await prisma.category.create({
    data: {
      name: 'Watches', slug: 'watches',
      subCategories: { create: [{ name: 'Luxury', slug: 'luxury-watches' }] }
    },
    include: { subCategories: true }
  });
  console.log('Categories created.');

  // 4. Create Products
  const products = [
    { name: 'Diamond Ring', slug: 'diamond-ring', price: 1200, status: ProductStatus.ACTIVE, cat: catJewelry, sub: catJewelry.subCategories[0] },
    { name: 'Gold Necklace', slug: 'gold-necklace', price: 800, status: ProductStatus.ACTIVE, cat: catJewelry, sub: catJewelry.subCategories[1] },
    { name: 'Vintage Rolex', slug: 'vintage-rolex', price: 4500, status: ProductStatus.ARCHIVED, cat: catWatches, sub: catWatches.subCategories[0] },
    { name: 'Silver Bracelet', slug: 'silver-bracelet', price: 300, status: ProductStatus.OUT_OF_STOCK, cat: catJewelry, sub: catJewelry.subCategories[0] },
  ];

  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name, slug: p.slug, description: `High quality ${p.name}`,
        price: p.price, quantity: 10, mainImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500',
        galleryImages: [], categoryId: p.cat.id, subCategoryId: p.sub.id,
        createdById: admin.id, status: p.status
      }
    });
    createdProducts.push(product);
  }
  console.log('Products created.');

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('--- [CRITICAL ERROR DURING SEEDING] ---');
    console.error('Message:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
