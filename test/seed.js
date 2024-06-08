const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const populate = async () => {

  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash(`user${i}_pass`, 10);
    const user = await prisma.user.create({
      data: {
        name: `User${i}`,
        phone: `987356789${i}`,
        email: `user${i}@gmail.com`,
        password: hashedPassword,
      },
    });
  }
};

populate().catch((e) => console.error(e));

