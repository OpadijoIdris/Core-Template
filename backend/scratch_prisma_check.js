import prisma from './src/config/postgres.js';

async function checkData() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (admin) {
      console.log('Admin user found:', {
        email: admin.email,
        role: admin.role,
        isVerified: admin.isVerified
      });
    } else {
      console.log('Admin user NOT found.');
      const count = await prisma.user.count();
      console.log('Total user count:', count);
    }
  } catch (err) {
    console.error('Prisma check failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
