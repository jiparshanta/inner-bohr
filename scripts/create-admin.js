const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@nepalcompanyreg.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    }
  });

  console.log('Admin created successfully!');
  console.log('Email:', admin.email);
  console.log('Password: Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
