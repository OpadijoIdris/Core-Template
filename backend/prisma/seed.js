import 'dotenv/config';
import prisma from '../src/config/postgres.js';
import pkg from '@prisma/client';
const { Role, ProductStatus, OrderStatus, PaymentProvider, PaymentStatus, ConversationStatus, MessageSenderRole } = pkg;
import bcrypt from 'bcrypt';

async function main() {
  console.log('--- [DEBUG] Seed Script Started ---');
  
  let url = process.env.DATABASE_URL;
  if (url) {
    // Clean the URL of any potential wrapping quotes or whitespace
    url = url.trim().replace(/^["'](.+)["']$/, '$1');
    console.log('--- [DEBUG] DATABASE_URL Length:', url.length);
    console.log('--- [DEBUG] DATABASE_URL Start:', url.substring(0, 10) + '...');
    
    try {
      const dbUrl = new URL(url);
      console.log('--- [DEBUG] DB Hostname:', dbUrl.hostname);
    } catch (e) {
      console.log('--- [DEBUG] Still could not parse DATABASE_URL after cleaning');
      console.log('--- [DEBUG] Error:', e.message);
    }
  } else {
    console.log('--- [DEBUG] DATABASE_URL is MISSING');
  }

  // 1. Clean existing data
  try {
    console.log('--- [DEBUG] Cleaning Message... ---');
    await prisma.message.deleteMany();
    console.log('--- [DEBUG] Cleaning Conversation... ---');
    await prisma.conversation.deleteMany();
    console.log('--- [DEBUG] Cleaning OrderAudit... ---');
    await prisma.orderAudit.deleteMany();
    console.log('--- [DEBUG] Cleaning OrderItem... ---');
    await prisma.orderItem.deleteMany();
    console.log('--- [DEBUG] Cleaning Order... ---');
    await prisma.order.deleteMany();
    console.log('--- [DEBUG] Cleaning CartItem... ---');
    await prisma.cartItem.deleteMany();
    console.log('--- [DEBUG] Cleaning Cart... ---');
    await prisma.cart.deleteMany();
    console.log('--- [DEBUG] Cleaning Product... ---');
    await prisma.product.deleteMany();
    console.log('--- [DEBUG] Cleaning SubCategory... ---');
    await prisma.subCategory.deleteMany();
    console.log('--- [DEBUG] Cleaning Category... ---');
    await prisma.category.deleteMany();
    console.log('--- [DEBUG] Cleaning User... ---');
    await prisma.user.deleteMany();
    console.log('Old data cleared.');
  } catch (error) {
    console.log('--- [DEBUG] Error clearing tables:', error.message);
  }

  // 2. Create Admin and Regular Users
  console.log('--- [DEBUG] Creating Users... ---');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      firstName: 'Coree',
      lastName: 'Admin',
    },
  });

  const users = [];
  const userEmails = ['john@example.com', 'jane@example.com', 'bob@example.com'];
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
    users.push(user);
  }
  console.log('Users created: Admin + 3 Customers.');

  // 3. Create Categories and Subcategories
  console.log('--- [DEBUG] Creating Categories... ---');
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
  console.log('--- [DEBUG] Creating Products... ---');
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

  // 5. Create Sample Orders
  console.log('--- [DEBUG] Creating Orders... ---');
  const order1 = await prisma.order.create({
    data: {
      user_id: users[0].id,
      status: OrderStatus.PAID,
      payment_provider: PaymentProvider.STRIPE,
      payment_status: PaymentStatus.SUCCESS,
      subtotal: 1200, total: 1200,
      items: { create: [{ productId: createdProducts[0].id, price: 1200, quantity: 1 }] }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      user_id: users[1].id,
      status: OrderStatus.PENDING,
      payment_provider: PaymentProvider.PAY_ON_DELIVERY,
      payment_status: PaymentStatus.PENDING,
      subtotal: 800, total: 800,
      items: { create: [{ productId: createdProducts[1].id, price: 800, quantity: 1 }] }
    }
  });
  console.log('Orders created.');

  // 6. Support Conversations
  console.log('--- [DEBUG] Creating Conversations... ---');
  await prisma.conversation.create({
    data: {
      userId: users[0].id,
      orderId: order1.id,
      status: ConversationStatus.OPEN,
      messages: {
        create: [
          { content: 'Hello, when will my ring arrive?', senderRole: MessageSenderRole.USER, senderId: users[0].id },
          { content: 'Hi! It is being shipped today.', senderRole: MessageSenderRole.ADMIN, senderId: admin.id }
        ]
      }
    }
  });
  console.log('Support chats created.');

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('--- [CRITICAL ERROR DURING SEEDING] ---');
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
