import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.person.createMany({
    data: [
      { name: 'John Doe', phoneNumber: '0412345678', email: 'john@example.com' },
      { name: 'Jane Smith', phoneNumber: '0423456789', email: 'jane@example.com' },
      { name: 'Alice Johnson', phoneNumber: '0434567890', email: 'alice@example.com' },
      { name: 'Bob Williams', phoneNumber: '0445678901', email: 'bob@example.com' },
      { name: 'Charlie Brown', phoneNumber: '0456789012', email: 'charlie@example.com' },
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
