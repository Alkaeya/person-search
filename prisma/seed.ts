import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get the admin user (created during migration)
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })

  if (!adminUser) {
    console.error('Admin user not found. Please run migrations first.')
    return
  }

  // Create sample persons for the admin user
  await prisma.person.createMany({
    data: [
      { name: 'John Doe', phoneNumber: '09171234567', email: 'john@example.com', userId: adminUser.id },
      { name: 'Jane Smith', phoneNumber: '09281234567', email: 'jane@example.com', userId: adminUser.id },
      { name: 'Alice Johnson', phoneNumber: '09351234567', email: 'alice@example.com', userId: adminUser.id },
      { name: 'Bob Williams', phoneNumber: '09461234567', email: 'bob@example.com', userId: adminUser.id },
      { name: 'Charlie Brown', phoneNumber: '09571234567', email: 'charlie@example.com', userId: adminUser.id },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
