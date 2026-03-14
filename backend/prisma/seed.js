import 'dotenv/config';
import prisma from '../src/config/postgres.js';
import { Role, ProductStatus, OrderStatus, PaymentProvider, PaymentStatus, ConversationStatus, MessageSenderRole } from '../src/generated/index.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('--- Deep Seeding Database ---');

  // 1. Clean existing data
  try {
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
    await prisma.user.deleteMany();
    console.log('Old data cleared.');
  } catch (error) {
    console.log('Note: Error clearing tables.');
  }

  // 2. Create Admin and Regular Users
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

  // 4. Create Products (Active and Archived)
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
  console.log('Products created (Active, Archived, OOS).');

  // 5. Create Sample Orders
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
  console.log('Orders created (Stripe Paid & POD Pending).');

  // 6. Create Support Conversations
  const conv1 = await prisma.conversation.create({
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

  const conv2 = await prisma.conversation.create({
    data: {
      userId: users[2].id,
      status: ConversationStatus.CLOSED,
      closedReason: 'Resolved by Admin',
      messages: {
        create: [
          { content: 'I forgot my password.', senderRole: MessageSenderRole.USER, senderId: users[2].id },
          { content: 'You can reset it via email.', senderRole: MessageSenderRole.ADMIN, senderId: admin.id }
        ]
      }
    }
  });
  console.log('Support chats created (Open & Closed).');

  console.log('--- Seeding Completed! ---');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
